import { qdrantClient } from "../providers/connectClient";
import "dotenv/config";

const collectionName = process.env.COLLECTION_NAME!;

export async function insertQdrantData(
  fields_data: {
    id: number;
    vector: number[];
    payload: { name: string };
  }[]
) {
  console.log("- Verbinden met Qdrant...");

  const collection = await qdrantClient.collectionExists(collectionName);

  if (collection) {
    console.log("Qdrant collectie bestaat al, verwijderen...");
    await qdrantClient.deleteCollection(collectionName);
    console.log("Qdrant collectie verwijderd");
  }

  await qdrantClient.createCollection(collectionName, {
    vectors: {
      size: 1536,
      distance: "Cosine",
    },
  });

  const start = performance.now();

  await qdrantClient.upsert(collectionName, {
    points: fields_data.map((data) => ({
      id: data.id,
      vector: data.vector,
      payload: data.payload,
    })),
  });

  await waitUntilQdrantIndexReady(collectionName);

  const durationMs = performance.now() - start;

  console.log("Data ingevoegd in Qdrant");

  return {
    durationMs,
    count: fields_data.length,
  };
}

async function waitUntilQdrantIndexReady(
  collectionName: string
): Promise<void> {
  while (true) {
    const info = await qdrantClient.getCollection(collectionName);
    if (info.status === "green") {
      return; // Index is klaar
    }
    await new Promise((r) => setTimeout(r, 100));
  }
}
