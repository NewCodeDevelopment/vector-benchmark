import { getEmbedding } from "./getEmbedding";
import { qdrantClient } from "../providers/connectClient";
import { normalizeVector } from "./normalizeVector";
import "dotenv/config";

const collectionName = process.env.COLLECTION_NAME!;

export async function searchInQdrant(query: string) {
  console.log("📡 Verbinden met Qdrant voor zoekopdracht...");

  const queryVector = await getEmbedding(query);
  const normalizedQuery = normalizeVector(queryVector);

  const beforeMemory = process.memoryUsage();
  const start = performance.now();

  const results = await qdrantClient.query(collectionName, {
    query: normalizedQuery,
    limit: 10,
    with_payload: true,
    params: {
      exact: true, // option to not use the approximate search (ANN) -->  Dus zelfde als FLAT
    },
  });

  const durationMs = performance.now() - start;
  const afterMemory = process.memoryUsage();

  results.points.forEach((point) => {
    console.log(
      `ID: ${point.id}, Score: ${point.score.toFixed(4)}, Text: ${
        point.payload?.text
      }`
    );
  });

  return {
    durationMs,
    memoryBefore: beforeMemory,
    memoryAfter: afterMemory,
    memoryDiff: {
      rss: afterMemory.rss - beforeMemory.rss,
      heapUsed: afterMemory.heapUsed - beforeMemory.heapUsed,
    },
    results: results.points,
  };
}
