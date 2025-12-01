import express from "express";
import fs from "fs";
import path from "path";
import { embedText, similarity, embedTextBatch } from "../../embeddings.js";
import { db } from "../../server.js";
import PATHS from "../../config/paths.js";

const router = express.Router();

let templateEmbeddings = null;
let itemEmbeddingsCache = null;
let lastInventoryUpdate = null;
let isProcessing = false;

function ensureTemplatesSeeded() {
  const templatesPath = path.join(PATHS.data, "templates.json");
  if (fs.existsSync(templatesPath)) {
    return templatesPath;
  }

  const fallbackPath = path.join(PATHS.server, "data", "templates.json");
  if (!fs.existsSync(fallbackPath)) {
    throw new Error("Default templates.json file is missing");
  }

  fs.mkdirSync(path.dirname(templatesPath), { recursive: true });
  fs.copyFileSync(fallbackPath, templatesPath);
  return templatesPath;
}

function keywordMatchTemplates(theme, templates, limit = 5) {
  const themeWords = theme.toLowerCase().split(/\s+/);

  const scoredTemplates = templates.map((template) => {
    let score = 0;
    const templateText = [
      template.name || "",
      template.theme || "",
      ...(template.theme_tags || []),
    ]
      .join(" ")
      .toLowerCase();

    themeWords.forEach((word) => {
      if (templateText.includes(word)) {
        score += 1;
      }
    });

    return {
      ...template,
      score,
      matchType: "keyword",
      confidence: Math.min(100, (score / themeWords.length) * 100).toFixed(1),
    };
  });

  return scoredTemplates
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

async function getTemplates() {
  const templatesPath = ensureTemplatesSeeded();
  return JSON.parse(fs.readFileSync(templatesPath, "utf-8"));
}

async function getTemplateEmbeddings(theme) {
  if (templateEmbeddings) return templateEmbeddings;

  console.log("Computing template embeddings for templates...");
  const templates = await getTemplates();

  try {
    const keywordMatches = keywordMatchTemplates(theme, templates, 20);

    if (keywordMatches.length === 0) {
      return [];
    }

    const textsToEmbed = keywordMatches.map((template) =>
      [
        template.name,
        template.theme,
        ...(template.theme_tags || []),
        ...(template.items?.map((item) => item.name) || []),
      ].join(" ")
    );

    const embeddings = await embedTextBatch(textsToEmbed, 5);

    templateEmbeddings = keywordMatches.map((template, index) => ({
      ...template,
      embedding: embeddings[index],
      matchType: "semantic",
    }));

    console.log(
      `Computed embeddings for ${templateEmbeddings.length} templates`
    );
    return templateEmbeddings;
  } catch (error) {
    console.error(
      "Failed to compute template embeddings, using keyword matching:",
      error
    );
    return keywordMatches;
  }
}

async function getItemEmbeddings() {
  const now = Date.now();
  if (
    !itemEmbeddingsCache ||
    !lastInventoryUpdate ||
    now - lastInventoryUpdate > 300000
  ) {
    console.log("🔄 Refreshing item embeddings cache...");

    await db.read();
    const items = db.data.items;

    const flowerItems = items.filter(
      (item) =>
        item &&
        item.category &&
        item.category.toLowerCase() === "flowers" &&
        item.stock > 0
    );

    const textsToEmbed = flowerItems.map((item) =>
      [item.name, item.category, item.description, ...(item.tags || [])].join(
        " "
      )
    );

    try {
      const embeddings = await embedTextBatch(textsToEmbed, 10);
      itemEmbeddingsCache = flowerItems.map((item, index) => ({
        ...item,
        embedding: embeddings[index],
      }));
    } catch (error) {
      console.error(
        "Failed to compute item embeddings, using basic matching:",
        error
      );
      itemEmbeddingsCache = flowerItems;
    }

    lastInventoryUpdate = now;
  }
  return itemEmbeddingsCache;
}

async function findBestMatchingItems(
  templateItem,
  availableItems,
  usedItemIds,
  themeEmbedding = null
) {
  const matches = [];

  for (const flower of availableItems) {
    if (usedItemIds.has(flower.id)) continue;

    let semanticScore = 0;
    let keywordScore = 0;
    let nameScore = 0;
    let tagScore = 0;

    if (flower.embedding && themeEmbedding) {
      semanticScore = similarity(themeEmbedding, flower.embedding);
    }

    if (flower.name.toLowerCase().includes(templateItem.name.toLowerCase())) {
      nameScore = 0.8;
    }

    if (flower.tags && Array.isArray(flower.tags)) {
      const flowerTags = flower.tags.map((t) => t.toLowerCase());
      const templateTags = (templateItem.tags || [templateItem.name]).map((t) =>
        t.toLowerCase()
      );
      const commonTags = flowerTags.filter((t) => templateTags.includes(t));
      tagScore =
        commonTags.length / Math.max(flowerTags.length, templateTags.length, 1);
    }

    if (flower.description) {
      const descWords = flower.description.toLowerCase().split(/\s+/);
      const templateWords = templateItem.name.toLowerCase().split(/\s+/);
      const matchingWords = templateWords.filter((word) =>
        descWords.some((descWord) => descWord.includes(word))
      );
      keywordScore = matchingWords.length / Math.max(templateWords.length, 1);
    }

    const totalScore =
      semanticScore * 0.4 +
      nameScore * 0.3 +
      tagScore * 0.2 +
      keywordScore * 0.1;

    if (totalScore > 0.1) {
      matches.push({
        flower,
        scores: {
          total: totalScore,
          semantic: semanticScore,
          name: nameScore,
          tag: tagScore,
          keyword: keywordScore,
        },
        breakdown: {
          semantic: `${(semanticScore * 100).toFixed(1)}%`,
          name: `${(nameScore * 100).toFixed(1)}%`,
          tag: `${(tagScore * 100).toFixed(1)}%`,
          keyword: `${(keywordScore * 100).toFixed(1)}%`,
        },
      });
    }
  }

  return matches.sort((a, b) => b.scores.total - a.scores.total);
}

async function buildBouquetResponse(
  res,
  template,
  theme,
  processingStartTime,
  templateConfidence,
  matchingMethod,
  filteredMatches
) {
  const flowerItems = await getItemEmbeddings();

  if (!flowerItems || flowerItems.length === 0) {
    return res.status(404).json({ error: "No flowers available in inventory" });
  }

  const bouquetItems = [];
  const usedItemIds = new Set();
  let totalMatchingScore = 0;

  for (const templateItem of template.items || []) {
    if (!templateItem || bouquetItems.length >= 8) break;

    const matches = await findBestMatchingItems(
      templateItem,
      flowerItems,
      usedItemIds
    );

    if (matches.length > 0) {
      const bestMatch = matches[0];
      const quantity = Math.min(
        templateItem.qty || templateItem.quantity || 3,
        Math.max(1, Math.floor(bestMatch.flower.stock * 0.5))
      );

      bouquetItems.push({
        id: bestMatch.flower.id,
        name: bestMatch.flower.name,
        tags: bestMatch.flower.tags,
        stock: bestMatch.flower.stock,
        price: bestMatch.flower.price,
        cost: bestMatch.flower.cost,
        photo: bestMatch.flower.photo,
        quantity,
        totalCost: +(bestMatch.flower.cost * quantity).toFixed(2),
        totalPrice: +(bestMatch.flower.price * quantity).toFixed(2),
        matchingAnalysis: {
          overallConfidence: `${(bestMatch.scores.total * 100).toFixed(1)}%`,
          scoreBreakdown: bestMatch.breakdown,
          matchReasons: [
            bestMatch.scores.semantic > 0.3 && "Semantic meaning matches theme",
            bestMatch.scores.name > 0.5 && "Name closely matches template",
            bestMatch.scores.tag > 0.3 && "Tags align with requirements",
            bestMatch.scores.keyword > 0.2 &&
              "Description contains relevant keywords",
          ].filter(Boolean),
        },
      });

      totalMatchingScore += bestMatch.scores.total;
      usedItemIds.add(bestMatch.flower.id);
    }
  }

  const totalCost = bouquetItems.reduce((sum, i) => sum + i.totalCost, 0);
  const totalPrice = bouquetItems.reduce((sum, i) => sum + i.totalPrice, 0);
  const processingTime = Date.now() - processingStartTime;

  const averageItemConfidence =
    bouquetItems.length > 0
      ? ((totalMatchingScore / bouquetItems.length) * 100).toFixed(1)
      : "0.0";

  return res.json({
    theme,
    template: {
      id: template.id,
      name: template.name || template.theme,
      theme: template.theme,
      themeTags: template.theme_tags || [],
    },
    matchingAnalysis: {
      method: matchingMethod || "keyword",
      templateConfidence: `${templateConfidence}%`,
      averageItemConfidence: `${averageItemConfidence}%`,
      processingTime: `${processingTime}ms`,
      totalTemplatesConsidered: filteredMatches ? filteredMatches.length : 1,
      matchingEngine: "AI Semantic + Keyword",
    },
    financials: {
      totalCost: +totalCost.toFixed(2),
      totalPrice: +totalPrice.toFixed(2),
      profitMargin: +(totalPrice - totalCost).toFixed(2),
      profitMarginPercentage: +(
        ((totalPrice - totalCost) / totalCost) *
        100
      ).toFixed(1),
      recommendedPrice: +totalPrice.toFixed(2),
    },
    composition: {
      totalItems: bouquetItems.length,
      totalQuantity: bouquetItems.reduce((s, i) => s + i.quantity, 0),
      stockUtilization: "conservative",
      uniqueFlowers: bouquetItems.length,
    },
    items: bouquetItems,
    metadata: {
      generatedAt: new Date().toISOString(),
      systemVersion: "2.0.0",
      inventorySnapshot: `${flowerItems.length} flowers available`,
    },
  });
}
router.post("/suggest", async (req, res) => {
  const { theme, excludeIds = [], preferredId } = req.body;

  if (!theme || typeof theme !== "string") {
    return res
      .status(400)
      .json({ error: "Theme is required and must be a string" });
  }

  if (isProcessing) {
    return res.status(429).json({
      error: "System is processing another request, please try again shortly",
    });
  }

  isProcessing = true;
  const processingStartTime = Date.now();

  try {
    console.log(`🎨 Generating bouquet for theme: "${theme}"`);

    const templates = await getTemplates();

    if (preferredId) {
      const preferredTemplate = templates.find(
        (t) => t.id === preferredId && !excludeIds.includes(t.id)
      );
      if (preferredTemplate) {
        console.log(`🌹 Using preferred template: ${preferredTemplate.id}`);
        return await buildBouquetResponse(
          res,
          preferredTemplate,
          theme,
          processingStartTime,
          "100.0", // High confidence for preferred template
          "preferred",
          [preferredTemplate]
        );
      }
    }

    const keywordMatches = keywordMatchTemplates(theme, templates, 10);

    const filteredMatches = keywordMatches.filter(
      (t) => !excludeIds.includes(t.id)
    );

    if (filteredMatches.length === 0) {
      return res.status(404).json({
        error: "No more bouquet templates available after exclusions.",
        suggestion: "Try another theme or reset exclusions",
      });
    }

    if (keywordMatches.length === 0) {
      return res.status(404).json({
        error: "No bouquet templates match this theme.",
        suggestion:
          "Try themes like 'romantic', 'happy', 'elegant', 'wedding', or 'birthday'",
      });
    }

    let chosenTemplate = filteredMatches[0];
    let matchingMethod = "keyword";
    let templateConfidence = chosenTemplate.confidence;
    let themeEmbedding = null;
    let alternativeTemplates = [];

    try {
      const templateEmbeddings = await getTemplateEmbeddings(theme);
      if (templateEmbeddings.length > 0) {
        themeEmbedding = await embedText(theme.toLowerCase());

        const scoredTemplates = templateEmbeddings.map((template) => {
          const semanticScore = similarity(themeEmbedding, template.embedding);

          const bias = template.feedback?.score || 0;
          const biasWeight = 1 + bias * 0.05; // each +1 feedback = +5% influence

          const finalScore =
            (template.matchType === "semantic"
              ? semanticScore
              : template.score / 10) * biasWeight;

          return {
            ...template,
            semanticScore,
            finalScore,
          };
        });

        scoredTemplates.sort((a, b) => b.finalScore - a.finalScore);

        const goodAIMatches = scoredTemplates.filter((t) => t.finalScore > 0.2);
        if (goodAIMatches.length > 0) {
          chosenTemplate = goodAIMatches[0];
          matchingMethod = chosenTemplate.matchType;
          templateConfidence = (chosenTemplate.finalScore * 100).toFixed(1);

          alternativeTemplates = goodAIMatches.slice(1, 4).map((t) => ({
            id: t.id,
            name: t.name,
            theme: t.theme,
            confidence: `${(t.finalScore * 100).toFixed(1)}%`,
            matchType: t.matchType,
            score: t.finalScore,
          }));

          console.log(
            `🤖 Using ${matchingMethod} matching (confidence: ${templateConfidence}%)`
          );
        }
      }
    } catch (aiError) {
      console.log(
        "🔧 AI matching failed, using keyword results:",
        aiError.message
      );
    }

    return await buildBouquetResponse(
      res,
      chosenTemplate,
      theme,
      processingStartTime,
      templateConfidence,
      matchingMethod,
      filteredMatches
    );
  } catch (err) {
    console.error("Error generating bouquet:", err);

    const errorResponse = {
      error: "Failed to generate bouquet suggestion",
      details: err.message,
      timestamp: new Date().toISOString(),
      recoverySuggestion:
        "Please try again with a different theme or check system status",
    };

    if (err.code === "ENOENT") {
      errorResponse.error = "Templates file not found";
    } else if (err.response) {
      errorResponse.error = "Failed to fetch inventory data";
    } else if (err.message.includes("memory")) {
      errorResponse.error = "System temporarily overloaded";
      errorResponse.recoverySuggestion =
        "Please try a simpler theme or wait a moment";
    }

    res.status(500).json(errorResponse);
  } finally {
    isProcessing = false;
  }
});

router.get("/status", (req, res) => {
  res.json({
    status: "operational",
    ai: {
      embeddingsLoaded: !!templateEmbeddings,
      model: "all-MiniLM-L6-v2",
      capabilities: ["semantic_matching", "keyword_fallback"],
    },
    cache: {
      templates: templateEmbeddings
        ? `${templateEmbeddings.length} templates`
        : "not loaded",
      items: itemEmbeddingsCache
        ? `${itemEmbeddingsCache.length} flowers`
        : "not loaded",
      lastUpdated: lastInventoryUpdate
        ? new Date(lastInventoryUpdate).toISOString()
        : "never",
    },
    performance: {
      concurrentRequests: isProcessing ? 1 : 0,
      maxConcurrent: 1,
    },
  });
});

router.post("/feedback", async (req, res) => {
  const { templateId, rating } = req.body;

  if (!templateId || !["up", "down"].includes(rating)) {
    return res.status(400).json({
      error: "Invalid feedback data",
      details: "templateId and rating ('up' or 'down') are required",
    });
  }

  try {
    const templatesPath = path.join(PATHS.data, "templates.json");
    const templates = JSON.parse(fs.readFileSync(templatesPath, "utf-8"));

    const templateIndex = templates.findIndex((t) => t.id === templateId);
    if (templateIndex === -1) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Adjust bias (defaults to 0.5 if not set)
    let currentBias = templates[templateIndex].bias ?? 0.5;
    const delta = rating === "up" ? 0.05 : -0.05;
    currentBias = Math.max(0, Math.min(1, currentBias + delta)); // keep between 0–1

    templates[templateIndex].bias = parseFloat(currentBias.toFixed(2));

    fs.writeFileSync(templatesPath, JSON.stringify(templates, null, 2));

    console.log(
      `⭐ Feedback for ${templateId}: ${rating} (new bias ${currentBias})`
    );

    res.json({
      success: true,
      message: "Feedback recorded",
      newBias: currentBias,
      templateId,
    });
  } catch (error) {
    console.error("Failed to update bias:", error);
    res.status(500).json({ error: "Failed to update template bias" });
  }
});

export default router;
