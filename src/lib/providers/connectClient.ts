import { MilvusClient } from "@zilliz/milvus2-sdk-node";
import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";
import "dotenv/config";

export const milvusClient = new MilvusClient({
  address: process.env.DATABASE_ADDRESS!,
});

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL!,
});

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});
