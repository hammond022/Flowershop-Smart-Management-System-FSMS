import { pipeline } from "@xenova/transformers";
import cosineSimilarity from "cosine-similarity";

let embedder = null;

async function getEmbedder() {
  if (!embedder) {
    console.log("🔄 Loading embedding model...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ Embedding model loaded");
  }
  return embedder;
}

export async function embedText(text) {
  try {
    const localEmbedder = await getEmbedder();
    const result = await localEmbedder(text, {
      pooling: "mean",
      normalize: true,
    });
    return Array.from(result.data);
  } catch (error) {
    console.error("Error in embedText:", error);
    throw error;
  }
}

export function similarity(a, b) {
  return cosineSimilarity(a, b);
}

export async function embedTextBatch(texts, batchSize = 5) {
  const embeddings = [];
  for (const text of texts) {
    const embedding = await embedText(text);
    embeddings.push(embedding);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return embeddings;
}
