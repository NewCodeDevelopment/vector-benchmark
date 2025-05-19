import { faker } from "@faker-js/faker/locale/nl_BE";
import { getEmbedding } from "../lib/helpers/getEmbedding";
import { createWriteStream } from "fs";

const outputFile = "src/data/data-medium.json";
// const outputFile = "src/data/data-small.json"; // 1K
// const outputFile = "src/data/data-medium.json"; // 3K
// const outputFile = "src/data/data-large.json"; // 5K

const ws = createWriteStream(outputFile, { flags: "a" });

const results = await Promise.all(
  Array.from({ length: 1000 }, () => faker.person.fullName()).map((name) =>
    getEmbedding(name)
  )
);

results.forEach((embedding) => ws.write(`${JSON.stringify(embedding)},\n`));

// // for (let i = 0; i < 50; i++) {
// //   console.log(`Run ${i + 1}/50`);
// //   await Promise.all(
// //     Array.from({ length: 1000 }, () => faker.person.fullName())
// //       .map((name) => getEmbedding(name))
// //       .map((embedding) => ws.write(`${JSON.stringify(embedding)},\n`))
// //   );
// //   // const name = faker.person.fullName();
// //   // const embedding = await getEmbedding(name);
// //   // ws.write(`${JSON.stringify(embedding)},\n`);
// // }

// ws.write("]");

ws.end();
