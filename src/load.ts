import fs from "fs/promises";
import { searchInMilvus2 } from "./lib/helpers/searchInMilvus";
import { searchInQdrant2 } from "./lib/helpers/searchInQdrant";

const dataSmall: number[][] = JSON.parse(
  await fs.readFile("src/data/data-small.json", "utf-8")
);

// 10K
const dataMedium = [
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
];

const hk = [
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
];

// 300K
const max = [...hk, ...hk, ...hk];

// const dataMedium = [...dataSmall, ...dataSmall, ...dataSmall];

// const dataLarge = [
//   ...dataSmall,
//   ...dataSmall,
//   ...dataSmall,
//   ...dataSmall,
//   ...dataSmall,
// ];

// const dataLarge2 = [
//   ...dataSmall,
//   ...dataSmall,
//   ...dataSmall,
//   ...dataSmall,
//   ...dataSmall,
//   ...dataSmall,
//   ...dataSmall,
//   ...dataSmall,
//   ...dataSmall,
//   ...dataSmall,
// ];

// 20K
const dataLarge3 = [
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
  ...dataSmall,
];

console.info("Start Milvus");
await Promise.all(dataSmall.map((embedding) => searchInMilvus2(embedding)));
console.info("Stop Milvus");

console.info("Start Qdrant");
await Promise.all(dataSmall.map((embedding) => searchInQdrant2(embedding)));
console.info("Stop Qdrant");

console.log("Length", dataSmall.length);
console.log("Done");
