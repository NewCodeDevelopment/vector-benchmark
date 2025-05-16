import path from "path";
import fs from "fs-extra";

export interface SearchMetrics {
  durationMs: number;
  results: any[];
}

export async function generateSearchSpeedMarkdownReport(
  milvusList: SearchMetrics[],
  qdrantList: SearchMetrics[],
  queries: string[]
) {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Amsterdam",
  };

  const milvusDurations = milvusList.map((m) => m.durationMs);
  const qdrantDurations = qdrantList.map((q) => q.durationMs);

  const milvusMean = calculateMean(milvusDurations);
  const milvusMedian = calculateMedian(milvusDurations);

  const qdrantMean = calculateMean(qdrantDurations);
  const qdrantMedian = calculateMedian(qdrantDurations);

  const timestamp = new Date().toISOString();
  const date = new Date(timestamp);
  const readableDate = date.toLocaleString("nl-NL", options);

  const lines: string[] = [];

  lines.push(`# Search Speed rapport`);
  lines.push(`**Timestamp:** ${readableDate}`);
  lines.push("");

  // Zoekduur overzichtstabel
  lines.push(`## Zoekduur per zoekopdracht`);
  lines.push("");
  lines.push(`| # | Zoekopdracht | Milvus (ms) | Qdrant (ms) |`);
  lines.push(`|--:|--------------|-------------:|-------------:|`);

  queries.forEach((query, index) => {
    const milvus = milvusList[index];
    const qdrant = qdrantList[index];
    lines.push(
      `| ${index + 1} | ${query} | ${milvus.durationMs.toFixed(
        2
      )} | ${qdrant.durationMs.toFixed(2)} |`
    );
  });

  lines.push("");

  lines.push(`## Statistieken Overzicht`);
  lines.push("");
  lines.push(`### Milvus`);
  lines.push(`- Gemiddelde zoekduur: ${milvusMean.toFixed(2)} ms`);
  lines.push(`- Mediaan zoekduur: ${milvusMedian.toFixed(2)} ms`);
  lines.push("");
  lines.push(`### Qdrant`);
  lines.push(`- Gemiddelde zoekduur: ${qdrantMean.toFixed(2)} ms`);
  lines.push(`- Mediaan zoekduur: ${qdrantMedian.toFixed(2)} ms`);
  lines.push("");

  // Gedetailleerde resultaten per zoekopdracht
  queries.forEach((query, index) => {
    lines.push(`## 🔍 Zoekopdracht ${index + 1}: ${query}`);
    lines.push("");

    const milvus = milvusList[index];
    const qdrant = qdrantList[index];

    lines.push(`### Resultaten`);
    lines.push(`#### Milvus`);
    milvus.results.forEach((r) => {
      lines.push(`- (${(r.score || 0).toFixed(4)}) ${r.naam}`);
    });

    lines.push("");
    lines.push(`#### Qdrant`);
    qdrant.results.forEach((r) => {
      lines.push(`- (${(r.score || 0).toFixed(4)}) ${r.payload?.name}`);
    });
    lines.push("");
  });

  // Schrijf naar het bestand
  const markdown = lines.join("\n");
  const outputPath = path.resolve("results/search_speed_report.md");

  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, markdown, "utf-8");

  console.log(`Markdown rapport opgeslagen in ${outputPath}`);
}
export async function generateSpeedInsertMarkdownReport(
  milvusInsert: { durationMs: number; count: number }[],
  qdrantInsert: { durationMs: number; count: number }[]
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

  const milvusDurations = milvusInsert.map((r) => r.durationMs);
  const qdrantDurations = qdrantInsert.map((r) => r.durationMs);

  const lines: string[] = [];

  lines.push(`# Insert Speed rapport`);
  lines.push(`**Timestamp:** ${readableDate}`);
  lines.push("");

  // Tabelheader met count per systeem
  lines.push(`## Insert duur per dataset`);
  lines.push("");
  lines.push(
    `| # | Count data (Milvus) | Count data (Qdrant) | Milvus (ms) | Qdrant (ms) |`
  );
  lines.push(
    `|--:|-------------------:|--------------------:|------------:|------------:|`
  );

  const maxLen = Math.max(milvusInsert.length, qdrantInsert.length);

  for (let i = 0; i < maxLen; i++) {
    const milvus = milvusInsert[i];
    const qdrant = qdrantInsert[i];

    // Default fallback als data ontbreekt
    const milvusCount = milvus?.count ?? "-";
    const qdrantCount = qdrant?.count ?? "-";
    const milvusDuration = milvus?.durationMs
      ? milvus.durationMs.toFixed(2)
      : "-";
    const qdrantDuration = qdrant?.durationMs
      ? qdrant.durationMs.toFixed(2)
      : "-";

    lines.push(
      `| ${
        i + 1
      } | ${milvusCount} | ${qdrantCount} | ${milvusDuration} | ${qdrantDuration} |`
    );
  }

  lines.push("");

  lines.push("### Samenvatting");
  lines.push("");
  lines.push(
    `| Systeem | Gemiddelde insert tijd (ms) | Mediaan insert tijd (ms) |`
  );
  lines.push(
    `|---------|----------------------------:|-------------------------:|`
  );
  lines.push(
    `| Milvus  | ${calculateMean(milvusDurations).toFixed(
      2
    )}         | ${calculateMedian(milvusDurations).toFixed(2)}     |`
  );
  lines.push(
    `| Qdrant  | ${calculateMean(qdrantDurations).toFixed(
      2
    )}         | ${calculateMedian(qdrantDurations).toFixed(2)}     |`
  );

  lines.push("");
  // Schrijf naar het bestand
  const markdown = lines.join("\n");
  const outputPath = path.resolve("results/insert_speed_report.md");

  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, markdown, "utf-8");

  console.log(`Markdown rapport opgeslagen in ${outputPath}`);
}

function calculateMean(values: number[]): number {
  const total = values.reduce((acc, val) => acc + val, 0);
  return total / values.length;
}

function calculateMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    return sorted[mid];
  }
}
