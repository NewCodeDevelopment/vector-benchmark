import { MilvusClient } from "@zilliz/milvus2-sdk-node";
import "dotenv/config";

export const milvusClient = new MilvusClient({
  address: process.env.DATABASE_ADDRESS!,
});
