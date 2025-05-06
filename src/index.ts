import { generateMarkdownReport } from "./lib/helpers/generateMarkdownReport";
import { searchInMilvus } from "./lib/helpers/searchInMilvus";
import { searchInQdrant } from "./lib/helpers/searchInQdrant";
import data from "./lib/data/names.json";

// async function main() {
//   const query = "Een leeuw vliegt in de bergen.";

//   const milvusMetrics = await searchInMilvus(query);
//   const qdrantMetrics = await searchInQdrant(query);

//   await generateMarkdownReport(milvusMetrics, qdrantMetrics, query);
// }

// main().catch(console.error);

async function main() {
  const queries = [
    "Een leeuw vliegt in de bergen.",
    "Wat is de hoofdstad van Frankrijk?",
    "Hoe werkt quantumcomputing?",
  ];


  const milvusMetricsList: any[] = [];
  const qdrantMetricsList: any[] = [];

  // Voer voor elke query de zoekopdrachten uit
  for (const query of queries) {
    console.log(`🏃‍♂️ Uitvoeren van zoekopdracht: "${query}"`);

    // Milvus en Qdrant zoeken voor deze query
    const milvusMetrics = await searchInMilvus(query);
    const qdrantMetrics = await searchInQdrant(query);

    // Voeg de resultaten toe aan de lijst
    milvusMetricsList.push(milvusMetrics);
    qdrantMetricsList.push(qdrantMetrics);
  }

  // Genereer het Markdown-rapport voor alle zoekopdrachten
  await generateMarkdownReport(milvusMetricsList, qdrantMetricsList, queries);
}

main().catch(console.error);
