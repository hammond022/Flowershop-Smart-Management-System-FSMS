import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import { embedText, similarity, embedTextBatch } from "../../embeddings.js";

const router = express.Router();

let templateEmbeddings = null;
let itemEmbeddingsCache = null;
let lastInventoryUpdate = null;
let isProcessing = false;

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
  const templatesPath = path.resolve("data/templates.json");
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
    const response = await axios.get("http://localhost:3000/api/items");
    const items = response.data;
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

router.post("/suggest", async (req, res) => {
  const { theme } = req.body;

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
    const keywordMatches = keywordMatchTemplates(theme, templates, 10);

    if (keywordMatches.length === 0) {
      return res.status(404).json({
        error: "No bouquet templates match this theme.",
        suggestion:
          "Try themes like 'romantic', 'happy', 'elegant', 'wedding', or 'birthday'",
      });
    }

    let chosenTemplate = keywordMatches[0];
    let matchingMethod = "keyword";
    let templateConfidence = chosenTemplate.confidence;
    let themeEmbedding = null;
    let alternativeTemplates = [];

    try {
      const templateEmbeddings = await getTemplateEmbeddings(theme);
      if (templateEmbeddings.length > 0) {
        themeEmbedding = await embedText(theme.toLowerCase());

        const scoredTemplates = templateEmbeddings.map((template) => ({
          ...template,
          semanticScore: similarity(themeEmbedding, template.embedding),
          finalScore:
            template.matchType === "semantic"
              ? similarity(themeEmbedding, template.embedding)
              : template.score / 10,
        }));

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

    const flowerItems = await getItemEmbeddings();

    if (!flowerItems || flowerItems.length === 0) {
      return res
        .status(404)
        .json({ error: "No flowers available in inventory" });
    }

    const bouquetItems = [];
    const usedItemIds = new Set();
    let totalMatchingScore = 0;

    for (const templateItem of chosenTemplate.items || []) {
      if (!templateItem || bouquetItems.length >= 8) break;

      const matches = await findBestMatchingItems(
        templateItem,
        flowerItems,
        usedItemIds,
        themeEmbedding
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
              bestMatch.scores.semantic > 0.3 &&
                "Semantic meaning matches theme",
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

    if (bouquetItems.length === 0) {
      return res.status(404).json({
        error: "No matching flowers available for this template",
        attemptedTemplate: chosenTemplate.name,
        suggestion: "Try refreshing inventory or using a different theme",
      });
    }

    const totalCost = bouquetItems.reduce((sum, i) => sum + i.totalCost, 0);
    const totalPrice = bouquetItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const averageItemConfidence = (
      (totalMatchingScore / bouquetItems.length) *
      100
    ).toFixed(1);
    const processingTime = Date.now() - processingStartTime;

    const bouquet = {
      theme,
      template: {
        id: chosenTemplate.id,
        name: chosenTemplate.name || chosenTemplate.theme,
        theme: chosenTemplate.theme,
        themeTags: chosenTemplate.theme_tags || [],
      },
      matchingAnalysis: {
        method: matchingMethod,
        templateConfidence: `${templateConfidence}%`,
        averageItemConfidence: `${averageItemConfidence}%`,
        processingTime: `${processingTime}ms`,
        totalTemplatesConsidered: keywordMatches.length,
        matchingEngine: themeEmbedding
          ? "AI Semantic + Keyword"
          : "Keyword Only",
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
        stockUtilization: "conservative", // or "balanced", "aggressive"
        uniqueFlowers: bouquetItems.length,
      },
      items: bouquetItems,
      recommendations: {
        alternativeTemplates,
        suggestedThemes: ["romantic", "joyful", "elegant", "vibrant"].filter(
          (t) => t !== theme.toLowerCase()
        ),
        seasonalNote: "Consider seasonal availability for best pricing",
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        systemVersion: "2.0.0",
        inventorySnapshot: `${flowerItems.length} flowers available`,
      },
    };

    console.log(
      `💐 Generated "${bouquet.template.name}" with ${bouquet.items.length} items`
    );
    console.log(
      `   📊 Confidence: ${bouquet.matchingAnalysis.templateConfidence} | Items: ${bouquet.matchingAnalysis.averageItemConfidence}`
    );
    console.log(
      `   💰 Price: $${bouquet.financials.totalPrice} | Margin: ${bouquet.financials.profitMarginPercentage}%`
    );
    console.log(`   ⚡ Processing: ${bouquet.matchingAnalysis.processingTime}`);

    res.json(bouquet);
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

export default router;
