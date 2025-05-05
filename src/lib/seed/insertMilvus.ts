import { DataType } from "@zilliz/milvus2-sdk-node";
import { milvusClient } from "../providers/connectClient";
import { zinnen } from "../data/data";
import { normalizeVector } from "../helpers/normalizeVector";
import { getEmbedding } from "../helpers/getEmbedding";
import "dotenv/config";

const collectionName = process.env.COLLECTION_NAME!;

export async function insertMilvusData() {
  console.log("📡 Verbinden met Milvus...");

  const collection = await milvusClient.hasCollection({
    collection_name: collectionName,
  });

  if (collection) {
    console.log("✅ Milvus collectie bestaat al, verwijderen...");
    await milvusClient.dropCollection({ collection_name: collectionName });
    console.log("✅ Milvus collectie verwijderd");
  }

  await milvusClient.createCollection({
    collection_name: collectionName,
    fields: [
      {
        name: "id",
        data_type: DataType.Int64,
        is_primary_key: true,
        autoID: false,
      },
      {
        name: "embedding",
        data_type: DataType.FloatVector,
        type_params: { dim: "1536" },
      },
      {
        name: "text",
        data_type: DataType.VarChar,
        type_params: { max_length: "1024" },
      },
    ],
  });
  console.log("✅ Milvus collectie aangemaakt");

  const fields_data = await Promise.all(
    zinnen.map(async (text, i) => {
      const embedding = await getEmbedding(text);
      const normalized = normalizeVector(embedding);
      return {
        id: i + 1,
        embedding: normalized,
        text: text,
      };
    })
  );

  await milvusClient.insert({
    collection_name: collectionName,
    fields_data,
  });

  await milvusClient.flush({ collection_names: [collectionName] });
  console.log("💾 Data ingevoegd in Milvus");

  await milvusClient.createIndex({
    collection_name: collectionName,
    field_name: "embedding",
    index_name: "embedding_index",
    index_type: "FLAT",
    metric_type: "COSINE",
  });

  await milvusClient.loadCollection({ collection_name: collectionName });

  console.log("✅ Milvus setup voltooid");
}
