import { generateMarkdownReport } from "./lib/helpers/generateMarkdownReport";
import { searchInMilvus } from "./lib/helpers/searchInMilvus";
import { searchInQdrant } from "./lib/helpers/searchInQdrant";

async function main() {
  const queries = ["Sam Declerck", "Lucas", "MBA"];

  const groundTruths = [
    [
      "Sam Declerck",
      "Sam Claeys",
      "Sam Claeys",
      "Lucie Declerck",
      "Zoe Declerck",
    ], // Expected relevant results for "Sam Declerck"
    [
      "Lucas",
      "Lucas Smith",
      "Lucas Johnson",
      "Luca Verhaeghe",
      "Lukas Maes",
      "Lucie Declerck",
      "Lucie Jacobs",
    ], // Expected relevant results for "Lucas"
    [
      "Sofia Thijs MBA",
      "Rayan Desmet MBA",
      "Janne Smet MBA",
      "Noor Willems MBA",
      "Robin Goossens MBA",
    ], // Expected relevant results for "MBA"
  ];

  const milvusMetricsList: any[] = [];
  const qdrantMetricsList: any[] = [];

  // Voer voor elke query de zoekopdrachten uit
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    const groundTruth = groundTruths[i];

    console.log(`🏃‍♂️ Uitvoeren van zoekopdracht: "${query}"`);

    // Milvus en Qdrant zoeken voor deze query
    const milvusMetrics = await searchInMilvus(query, groundTruth);
    const qdrantMetrics = await searchInQdrant(query, groundTruth);

    // Voeg de resultaten toe aan de lijst
    milvusMetricsList.push(milvusMetrics);
    qdrantMetricsList.push(qdrantMetrics);
  }

  await generateMarkdownReport(milvusMetricsList, qdrantMetricsList, queries);
}

main().catch(console.error);
