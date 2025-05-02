import { search } from "./lib/helpers/searchData";

async function main() {
  await search("Zin 4");
}

main().catch(console.error);
