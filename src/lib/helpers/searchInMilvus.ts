import { DataType } from "@zilliz/milvus2-sdk-node";
import { milvusClient } from "../providers/connectClient";
import { getEmbedding } from "./getEmbedding";
import "dotenv/config";
import { normalizeVector } from "./normalizeVector";

export async function searchInMilvus(query: string, groundTruth?: string[]) {
  console.log("Verbinden met Milvus...");

  const queryVector = await getEmbedding(query);
  const normalizedQuery = normalizeVector(queryVector);

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
    output_fields: ["id", "naam"],
  });

  const durationMs = performance.now() - start;

  return {
    durationMs,
    results: results.results,
  };
}

export async function searchInMilvus2(query: number[]) {
  console.log("Verbinden met Milvus...");

  await milvusClient.search({
    collection_name: process.env.COLLECTION_NAME!,
    vector: query,
    vector_type: DataType.FloatVector,
    params: {
      anns_field: "embedding",
      topk: "10",
      metric_type: "COSINE",
    },
    output_fields: ["id", "naam"],
  });
}
