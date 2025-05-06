import { faker } from "@faker-js/faker/locale/nl_BE";
import { writeFile } from "fs/promises";

export async function generateData() {
  // const data = faker.commerce.productDescription();
  const names = Array.from({ length: 1000 }, () => faker.person.fullName());
  await writeFile("src/lib/data/names.json", JSON.stringify(names, null, 2));
}

await generateData();
