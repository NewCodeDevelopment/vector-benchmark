import { insertMilvusData } from "./insertMilvus";
import { insertQdrantData } from "./insertQdrent";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  await insertMilvusData();
  await insertQdrantData();
}

main().catch(console.error);
