import { generateSpeedInsertMarkdownReport } from "../helpers/generateMarkdownReports";
import { insertMilvusData } from "./insertMilvus";
import { insertQdrantData } from "./insertQdrent";
import names from "../../data/names.json";
import * as dotenv from "dotenv";
import { getEmbedding } from "../helpers/getEmbedding";
import { normalizeVector } from "../helpers/normalizeVector";
dotenv.config();

async function main() {
  const fields_data_raw = await Promise.all(
    names.map(async (name, i) => {
      const embedding = await getEmbedding(name);
      const normalized = normalizeVector(embedding);
      return {
        id: i + 1,
        embedding: normalized,
        naam: name,
      };
    })
  );

  console.log("** EMBEDDING IS KLAAR...");

  const milvusResults: { durationMs: number; count: number }[] = [];
  const qdrantResults: { durationMs: number; count: number }[] = [];
  for (let i = 0; i < 5; i++) {
    console.log(`\n🔄 Run ${i + 1}/5`);

    const milvusInsert = await insertMilvusData(fields_data_raw);

    const qdrantInsert = await insertQdrantData(
      fields_data_raw.map((item) => ({
        id: item.id,
        vector: item.embedding,
        payload: { name: item.naam },
      }))
    );

    milvusResults.push(milvusInsert);
    qdrantResults.push(qdrantInsert);
  }

  await generateSpeedInsertMarkdownReport(milvusResults, qdrantResults);
}

main().catch(console.error);
