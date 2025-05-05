import { getEmbedding } from "../helpers/getEmbedding";
import { zinnen } from "../data/data";
import { qdrantClient } from "../providers/connectClient";
import { normalizeVector } from "../helpers/normalizeVector";
import "dotenv/config";

const collectionName = process.env.COLLECTION_NAME!;

export async function insertQdrantData() {
  console.log("📡 Verbinden met Qdrant...");

  const collection = await qdrantClient.collectionExists(collectionName);

  if (collection) {
    console.log("✅ Qdrant collectie bestaat al, verwijderen...");
    await qdrantClient.deleteCollection(collectionName);
    console.log("✅ Qdrant collectie verwijderd");
  }

  await qdrantClient.createCollection(collectionName, {
    vectors: {
      size: 1536,
      distance: "Cosine",
    },
  });

  const fields_data = await Promise.all(
    zinnen.map(async (text, i) => {
      const embedding = await getEmbedding(text);
      const normalized = normalizeVector(embedding);
      return {
        id: i + 1,
        vector: normalized,
        payload: { text },
      };
    })
  );

  // Gegevens invoegen in Qdrant
  await qdrantClient.upsert(collectionName, {
    points: fields_data.map((data) => ({
      id: data.id,
      vector: data.vector,
      payload: data.payload,
    })),
  });

  console.log("💾 Data ingevoegd in Qdrant");
}
