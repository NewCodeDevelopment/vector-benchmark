import path from "path";
import fs from "fs-extra";

export interface SearchMetrics {
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
  queries: string[]
) {
  const timestamp = new Date().toISOString();
  const lines: string[] = [];

  lines.push(`# Vergelijkingsrapport`);
  lines.push(`**Timestamp:** ${timestamp}`);
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

    // Voeg zoekresultaten toe
    lines.push(`### Resultaten`);
    lines.push(`#### Milvus`);
    milvus.results.forEach((r, i) => {
      lines.push(`- (${(r.score || 0).toFixed(4)}) ${r.text}`);
    });

    lines.push("");
    lines.push(`#### Qdrant`);
    qdrant.results.forEach((r, i) => {
      lines.push(`- (${(r.score || 0).toFixed(4)}) ${r.payload?.text}`);
    });
    lines.push("");
  });

  // Schrijf naar het bestand
  const markdown = lines.join("\n");
  const outputPath = path.resolve("results/search_comparison_report.md");
  await fs.writeFile(outputPath, markdown, "utf-8");

  console.log(`✅ Markdown rapport opgeslagen in ${outputPath}`);
}

// import path from "path";
// import fs from "fs-extra";

// export interface SearchMetrics {
//   durationMs: number;
//   memoryBefore: NodeJS.MemoryUsage;
//   memoryAfter: NodeJS.MemoryUsage;
//   memoryDiff: {
//     rss: number;
//     heapUsed: number;
//   };
//   results: any[];
// }

// function formatMemory(mem: NodeJS.MemoryUsage): string {
//   return `RSS: ${(mem.rss / 1_000_000).toFixed(2)} MB, Heap Used: ${(
//     mem.heapUsed / 1_000_000
//   ).toFixed(2)} MB`;
// }

// export async function generateMarkdownReport(
//   milvus: SearchMetrics,
//   qdrant: SearchMetrics,
//   query: string
// ) {
//   const timestamp = new Date().toISOString();
//   const lines: string[] = [];

//   lines.push(`# Vergelijkingsrapport`);
//   lines.push(`**Query:** \`${query}\``);
//   lines.push(`**Timestamp:** ${timestamp}`);
//   lines.push("");

//   lines.push(`## 🔍 Zoekduur`);
//   lines.push(`- **Milvus:** ${milvus.durationMs.toFixed(2)} ms`);
//   lines.push(`- **Qdrant:** ${qdrant.durationMs.toFixed(2)} ms`);
//   lines.push("");

//   lines.push(`## 🧠 Geheugenverbruik`);
//   lines.push(`### Milvus`);
//   lines.push(`- Voor: ${formatMemory(milvus.memoryBefore)}`);
//   lines.push(`- Na: ${formatMemory(milvus.memoryAfter)}`);
//   lines.push(
//     `- Verschil: RSS: ${(milvus.memoryDiff.rss / 1_000_000).toFixed(
//       2
//     )} MB, Heap Used: ${(milvus.memoryDiff.heapUsed / 1_000_000).toFixed(2)} MB`
//   );

//   lines.push(`### Qdrant`);
//   lines.push(`- Voor: ${formatMemory(qdrant.memoryBefore)}`);
//   lines.push(`- Na: ${formatMemory(qdrant.memoryAfter)}`);
//   lines.push(
//     `- Verschil: RSS: ${(qdrant.memoryDiff.rss / 1_000_000).toFixed(
//       2
//     )} MB, Heap Used: ${(qdrant.memoryDiff.heapUsed / 1_000_000).toFixed(2)} MB`
//   );
//   lines.push("");

//   lines.push(`## 📄 Resultaten`);
//   lines.push(`### Milvus`);
//   milvus.results.forEach((r, i) => {
//     lines.push(`- (${(r.score || 0).toFixed(4)}) ${r.text}`);
//   });

//   lines.push("");
//   lines.push(`### Qdrant`);
//   qdrant.results.forEach((r, i) => {
//     lines.push(`- (${(r.score || 0).toFixed(4)}) ${r.payload?.text}`);
//   });

//   const markdown = lines.join("\n");
//   const outputPath = path.resolve("results/search_comparison_report.md");
//   await fs.writeFile(outputPath, markdown, "utf-8");

//   console.log(`✅ Markdown rapport opgeslagen in ${outputPath}`);
// }
