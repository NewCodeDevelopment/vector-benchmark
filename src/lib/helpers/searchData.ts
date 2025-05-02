import { DataType } from "@zilliz/milvus2-sdk-node";
import "dotenv/config";
import { getEmbedding } from "../providers/openaiClient";
import { milvusClient } from "../providers/milvusClient";

export async function search(query: string) {
  console.log("📡 Verbinden met Milvus...");

  const queryVector = await getEmbedding(query);

  const results = await milvusClient.search({
    collection_name: process.env.COLLECTION_NAME!,
    vector: queryVector,
    vector_type: DataType.FloatVector,
    params: {
      anns_field: "embedding",
      metric_type: "IP",
      // params: JSON.stringify({ nprobe: 10 }), // Hoeveel worden er gezicht clusters
    },
    output_fields: ["id"],
  });

  console.log("🔍 Zoekresultaat:", JSON.stringify(results.results, null, 2));
}
// topk: 2,
// metric_type: "L2",
