import data from "./lib/data/names.json";


async function main() {
  console.log(data.slice(10, 20));
}

main().catch(console.error);
