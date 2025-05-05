import { DataType } from "@zilliz/milvus2-sdk-node";
import { milvusClient } from "../providers/connectClient";
import { getEmbedding } from "./getEmbedding";
import "dotenv/config";
import { normalizeVector } from "./normalizeVector";

export async function searchInMilvus(query: string) {
  console.log("📡 Verbinden met Milvus...");

  const queryVector = await getEmbedding(query);
  const normalizedQuery = normalizeVector(queryVector);

  const beforeMemory = process.memoryUsage();
  const start = performance.now();

  const results = await milvusClient.search({
    collection_name: process.env.COLLECTION_NAME!,
    vector: normalizedQuery,
    vector_type: DataType.FloatVector,
    params: {
      anns_field: "embedding", // Vector field name
      topk: "10",
      metric_type: "COSINE",
    },
    output_fields: ["id", "text"],
  });

  const durationMs = performance.now() - start;
  const afterMemory = process.memoryUsage();

  console.log("🔍 Zoekresultaat:", JSON.stringify(results.results, null, 2));

  return {
    durationMs,
    memoryBefore: beforeMemory,
    memoryAfter: afterMemory,
    memoryDiff: {
      rss: afterMemory.rss - beforeMemory.rss,
      heapUsed: afterMemory.heapUsed - beforeMemory.heapUsed,
    },
    results: results.results,
  };
}
