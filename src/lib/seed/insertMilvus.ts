import { DataType } from "@zilliz/milvus2-sdk-node";
import { milvusClient } from "../providers/connectClient";
import "dotenv/config";

const collectionName = process.env.COLLECTION_NAME!;

export async function insertMilvusData(
  fields_data: {
    id: number;
    embedding: number[];
    naam: string;
  }[]
) {
  console.log("- Verbinden met Milvus...");

  const collection = await milvusClient.hasCollection({
    collection_name: collectionName,
  });

  if (collection) {
    console.log("Milvus collectie bestaat al, verwijderen...");
    await milvusClient.dropCollection({ collection_name: collectionName });
    console.log("Milvus collectie verwijderd");
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
        name: "naam",
        data_type: DataType.VarChar,
        type_params: { max_length: "1024" },
      },
    ],
  });
  console.log("Milvus collectie aangemaakt");

  const start = performance.now();
  await milvusClient.insert({
    collection_name: collectionName,
    fields_data,
  });

  await milvusClient.flush({ collection_names: [collectionName] });

  await milvusClient.createIndex({
    collection_name: collectionName,
    field_name: "embedding",
    index_name: "embedding_index",
    index_type: "FLAT",
    metric_type: "COSINE",
  });

  await milvusClient.loadCollection({ collection_name: collectionName });

  const durationMs = performance.now() - start;

  console.log("Data ingevoegd in Milvus");
  return {
    durationMs,
    count: fields_data.length,
  };
}
