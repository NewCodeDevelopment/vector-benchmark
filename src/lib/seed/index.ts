import { DataType } from "@zilliz/milvus2-sdk-node";
import { milvusClient } from "../providers/milvusClient";
import * as dotenv from "dotenv";
import { getEmbedding } from "../providers/openaiClient";
dotenv.config();

const collectionName = process.env.COLLECTION_NAME!;

async function main() {
  console.log("📡 Verbinden met Milvus...");

  if (await milvusClient.hasCollection({ collection_name: collectionName })) {
    console.log("✅ Collectie bestaat al, verwijderen...");
    await milvusClient.dropCollection({ collection_name: collectionName });
    console.log("✅ Collectie verwijderd");
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
    ],
  });
  console.log("✅ Collectie aangemaakt");

  // Genereer en voeg embeddings toe
  const texts = ["Dit is zin 1", "Nog een tekstje", "Zin 3", "Zin 4"];
  // const fields_data = await Promise.all(
  //   texts.map(async (text, i) => ({
  //     id: i + 1,
  //     embedding: await getEmbedding(text),
  //   }))
  // );

  const fields_data = await Promise.all(
    texts.map(async (text, i) => {
      const embedding = await getEmbedding(text);
      // const normalizedEmbedding = normalizeVector(embedding); // Normaliseer de embedding
      return {
        id: i + 1,
        embedding: embedding,
      };
    })
  );

  await milvusClient.insert({
    collection_name: collectionName,
    fields_data,
  });

  await milvusClient.flush({ collection_names: [collectionName] });
  console.log("💾 Data ingevoegd en geflusht");

  // await milvusClient.createIndex({
  //   collection_name: collectionName,
  //   field_name: "embedding",
  //   index_name: "embedding_index",
  //   index_type: "IVF_FLAT",
  //   metric_type: "L2",
  //   params: { nlist: 1024 },
  // });
  await milvusClient.createIndex({
    collection_name: collectionName,
    field_name: "embedding",
    index_name: "embedding_index",
    // index_type: "IVF_FLAT",
    index_type: "FLAT",
    metric_type: "IP", // Cosine Similarity wordt als Inner Product gebruikt
    // params: { nlist: 1024 }, // hoeveel data in cluster
  });

  await milvusClient.loadCollection({ collection_name: collectionName });

  console.log("✅ Milvus setup voltooid");
}

main().catch(console.error);
