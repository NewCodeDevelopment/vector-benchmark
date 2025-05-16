import fs from "fs/promises";
import { searchInMilvus } from "./lib/helpers/searchInMilvus";
import { searchInQdrant } from "./lib/helpers/searchInQdrant";

async function runQueryForName(name: string) {
  return Promise.all([searchInMilvus(name), searchInQdrant(name)]);
}

async function main() {
  const namesRaw = await fs.readFile("src/lib/data/names.json", "utf-8");
  const names = JSON.parse(namesRaw);

  const doubledNames = [...names, ...names, ...names];

  const shuffled = doubledNames.toSorted(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 1500);

  await Promise.all(selected.map(runQueryForName));
  console.log("Done");
}

main().catch(console.error);
