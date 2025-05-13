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
    ],
    [
      "Lucas",
      "Lucas Smith",
      "Lucas Johnson",
      "Luca Verhaeghe",
      "Lukas Maes",
      "Lucie Declerck",
      "Lucie Jacobs",
    ],
    [
      "Sofia Thijs MBA",
      "Rayan Desmet MBA",
      "Janne Smet MBA",
      "Noor Willems MBA",
      "Robin Goossens MBA",
    ],
  ];

  const milvusMetricsList: any[] = [];
  const qdrantMetricsList: any[] = [];

  // Voer voor elke query de zoekopdrachten uit
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    const groundTruth = groundTruths[i];

    console.log(`Uitvoeren van zoekopdracht: "${query}"`);

    const milvusMetrics = await searchInMilvus(query, groundTruth);
    const qdrantMetrics = await searchInQdrant(query, groundTruth);

    milvusMetricsList.push(milvusMetrics);
    qdrantMetricsList.push(qdrantMetrics);
  }

  // Bereken globale MAP
  const milvusMAP =
    milvusMetricsList.reduce((acc, m) => acc + m.accuracyMetrics.ap, 0) /
    milvusMetricsList.length;
  const qdrantMAP =
    qdrantMetricsList.reduce((acc, m) => acc + m.accuracyMetrics.ap, 0) /
    qdrantMetricsList.length;

  console.log("\n\uD83D\uDCCA Gemiddelde MAP:");
  console.log("Milvus MAP:", milvusMAP.toFixed(4));
  console.log("Qdrant MAP:", qdrantMAP.toFixed(4));

  await generateMarkdownReport(
    milvusMetricsList,
    qdrantMetricsList,
    queries,
    milvusMAP,
    qdrantMAP
  );
}

main().catch(console.error);
