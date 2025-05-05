import fs from "fs";

interface Result {
  name: string;
  hz: number;
}

export function generateHtmlReport(results: Result[]) {
  const maxHz = Math.max(...results.map((r) => r.hz));
  const rows = results
    .map((r) => {
      const percent = ((r.hz / maxHz) * 100).toFixed(2);
      return `<div style="margin: 8px 0;">
        <strong>${r.name}</strong> (${r.hz.toFixed(2)} ops/sec)
        <div style="background:#ddd;width:100%;height:20px;">
          <div style="background:#4caf50;width:${percent}%;height:100%;"></div>
        </div>
      </div>`;
    })
    .join("\n");

  const html = `
    <html>
      <head><title>Benchmark Report</title></head>
      <body style="font-family: sans-serif; padding: 20px;">
        <h1>📊 Benchmark Resultaten</h1>
        ${rows}
      </body>
    </html>
  `;

  fs.writeFileSync("benchmark-report.html", html);
  console.log("✅ Rapport opgeslagen: benchmark-report.html");
}
