import path from "path";
import fs from "fs-extra";

export interface SearchMetrics {
  accuracyMetrics: any;
  durationMs: number;
  memoryBefore: NodeJS.MemoryUsage;
  memoryAfter: NodeJS.MemoryUsage;
  memoryDiff: {
    rss: number;
    heapUsed: number;
  };
  results: any[];
}

function formatMemory(mem: NodeJS.MemoryUsage): string {
  return `RSS: ${(mem.rss / 1_000_000).toFixed(2)} MB, Heap Used: ${(
    mem.heapUsed / 1_000_000
  ).toFixed(2)} MB`;
}

export async function generateMarkdownReport(
  milvusList: SearchMetrics[],
  qdrantList: SearchMetrics[],
  queries: string[],
  milvusMAP: number,
  qdrantMAP: number
) {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Amsterdam",
  };

  const timestamp = new Date().toISOString();
  const date = new Date(timestamp);

  const readableDate = date.toLocaleString("nl-NL", options);

  const lines: string[] = [];

  lines.push(`# Vergelijkingsrapport`);
  lines.push(`**Timestamp:** ${readableDate}`);
  lines.push("");

  // Loop door alle zoekopdrachten
  queries.forEach((query, index) => {
    lines.push(`## 🔍 Zoekopdracht ${index + 1}: ${query}`);
    lines.push("");

    const milvus = milvusList[index];
    const qdrant = qdrantList[index];

    // Voeg zoekduur toe
    lines.push(`### Zoekduur`);
    lines.push(`- **Milvus:** ${milvus.durationMs.toFixed(2)} ms`);
    lines.push(`- **Qdrant:** ${qdrant.durationMs.toFixed(2)} ms`);
    lines.push("");

    // Voeg geheugenverbruik toe
    lines.push(`### Geheugenverbruik`);
    lines.push(`#### Milvus`);
    lines.push(`- Voor: ${formatMemory(milvus.memoryBefore)}`);
    lines.push(`- Na: ${formatMemory(milvus.memoryAfter)}`);
    lines.push(
      `- Verschil: RSS: ${(milvus.memoryDiff.rss / 1_000_000).toFixed(
        2
      )} MB, Heap Used: ${(milvus.memoryDiff.heapUsed / 1_000_000).toFixed(
        2
      )} MB`
    );
    lines.push(`#### Qdrant`);
    lines.push(`- Voor: ${formatMemory(qdrant.memoryBefore)}`);
    lines.push(`- Na: ${formatMemory(qdrant.memoryAfter)}`);
    lines.push(
      `- Verschil: RSS: ${(qdrant.memoryDiff.rss / 1_000_000).toFixed(
        2
      )} MB, Heap Used: ${(qdrant.memoryDiff.heapUsed / 1_000_000).toFixed(
        2
      )} MB`
    );
    lines.push("");

    // Add accuracy metrics if available
    if (milvus.accuracyMetrics && qdrant.accuracyMetrics) {
      lines.push(`### Nauwkeurigheid`);

      lines.push(`#### Milvus`);
      lines.push(
        `- Precision@1: ${milvus.accuracyMetrics.precision.p1.toFixed(4)}`
      );
      lines.push(
        `- Precision@3: ${milvus.accuracyMetrics.precision.p3.toFixed(4)}`
      );
      lines.push(
        `- Precision@5: ${milvus.accuracyMetrics.precision.p5.toFixed(4)}`
      );
      lines.push(
        `- Precision@10: ${milvus.accuracyMetrics.precision.p10.toFixed(4)}`
      );
      lines.push(`- MRR: ${milvus.accuracyMetrics.mrr.toFixed(4)}`);
      lines.push(`- AP: ${milvus.accuracyMetrics.ap.toFixed(4)}`);

      lines.push(`#### Qdrant`);
      lines.push(
        `- Precision@1: ${qdrant.accuracyMetrics.precision.p1.toFixed(4)}`
      );
      lines.push(
        `- Precision@3: ${qdrant.accuracyMetrics.precision.p3.toFixed(4)}`
      );
      lines.push(
        `- Precision@5: ${qdrant.accuracyMetrics.precision.p5.toFixed(4)}`
      );
      lines.push(
        `- Precision@10: ${qdrant.accuracyMetrics.precision.p10.toFixed(4)}`
      );
      lines.push(`- MRR: ${qdrant.accuracyMetrics.mrr.toFixed(4)}`);
      lines.push(`- AP: ${qdrant.accuracyMetrics.ap.toFixed(4)}`);
      lines.push("");
    }

    // Voeg zoekresultaten toe
    lines.push(`### Resultaten`);
    lines.push(`#### Milvus`);
    milvus.results.forEach((r, i) => {
      lines.push(`- (${(r.score || 0).toFixed(4)}) ${r.naam}`);
    });

    lines.push("");
    lines.push(`#### Qdrant`);
    qdrant.results.forEach((r, i) => {
      lines.push(`- (${(r.score || 0).toFixed(4)}) ${r.payload?.name}`);
    });
    lines.push("");
  });

  lines.push(`**Milvus MAP:** ${milvusMAP.toFixed(4)}`);
  lines.push("");
  lines.push(`**Qdrant MAP:** ${qdrantMAP.toFixed(4)}`);

  // Schrijf naar het bestand
  const markdown = lines.join("\n");
  const outputPath = path.resolve("results/search_comparison_report.md");

  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, markdown, "utf-8");

  console.log(`✅ Markdown rapport opgeslagen in ${outputPath}`);
}
