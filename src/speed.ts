import { generateSearchSpeedMarkdownReport } from "./lib/helpers/generateMarkdownReports";
import { searchInMilvus } from "./lib/helpers/searchInMilvus";
import { searchInQdrant } from "./lib/helpers/searchInQdrant";

async function main() {
  const queries = [
    "Felix Declercq",
    "Floor",
    "Lander Lemmens",
    "Axelle Martens",
    "Margot Dewilde MBA",
    "Merel Vandevelde",
    "Flore Vandenbroeck",
    "Martens",
    "Jens Hermans",
    "Camille Hermans",
    "MBA",
    "Lewis Claeys",
    "Amélie Hermans MBA",
    "Emily",
    "Tibo Decoster",
    "Wouters",
    "Merel Declerck",
    "Ing. Imran Decoster",
    "Oscar Vandamme",
    "Maes",
  ];

  const milvusMetricsList: any[] = [];
  const qdrantMetricsList: any[] = [];

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];

    console.log(`Uitvoeren van zoekopdracht: "${query}"`);

    const milvusMetrics = await searchInMilvus(query);
    const qdrantMetrics = await searchInQdrant(query);

    milvusMetricsList.push(milvusMetrics);
    qdrantMetricsList.push(qdrantMetrics);
  }

  await generateSearchSpeedMarkdownReport(
    milvusMetricsList,
    qdrantMetricsList,
    queries
  );
}

main().catch(console.error);
