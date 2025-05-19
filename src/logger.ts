import { writeFile } from "fs/promises";
import { createWriteStream } from "fs";
import { exec } from "child_process";

async function createLogger(containerId: string) {
  const outputFile = `results/${containerId}-output.json`;

  await writeFile(outputFile, "[\n", "utf-8");

  const ws = createWriteStream(outputFile, { flags: "a" });

  const interval = setInterval(async () => {
    const results = await new Promise((resolve) => {
      exec(
        `docker stats --no-stream --format "{{json .}}" ${containerId}`,
        (err, stdout) => {
          if (err) return;
          try {
            const json = JSON.parse(stdout.trim());
            resolve({
              timestamp: new Date().toISOString(),
              containerId,
              ...json,
            });
          } catch {
            // parse failed
          }
        }
      );
    });

    if (results) {
      console.log("RESULTS", results);
      ws.write(JSON.stringify(results) + ",\n");
    }
  }, 500);

  process.on("exit", () => {
    clearInterval(interval);
    ws.write("]\n");
    ws.end();
  });
}

createLogger("milvus-standalone");
createLogger("qdrant");

// import Docker from "dockerode";
// import { createWriteStream } from "fs";
// import { writeFile } from "fs/promises";

// const docker = new Docker({ socketPath: "/var/run/docker.sock" });

// async function createLogger(containerId: string) {
//   const outputFile = `results/${containerId}-output.json`;

//   // 1) eerst het bestand helemaal schoonmaken
//   await writeFile(outputFile, "[", "utf-8");

//   // 2) open append-stream
//   const ws = createWriteStream(outputFile, { flags: "a" });

//   setInterval(async () => {
//     // Get the stats for the container
//     const container = docker.getContainer(containerId);
//     const entry = await container.stats({ stream: false });

//     const cpuDelta =
//       entry.cpu_stats.cpu_usage.total_usage -
//       entry.precpu_stats.cpu_usage.total_usage;
//     const systemDelta =
//       entry.cpu_stats.system_cpu_usage - entry.precpu_stats.system_cpu_usage;
//     const numberOfCores = entry.cpu_stats.online_cpus;
//     const cpuPercent = (cpuDelta / systemDelta) * numberOfCores * 100;

//     const mbUsage = entry.memory_stats.usage / 1024 / 1024;

//     // Map the stdout to a JSON object
//     const data = {
//       containerId,
//       cpu: cpuPercent,
//       mem: mbUsage,
//       time: entry?.read,
//     };

//     // Add the data to the file
//     ws.write(`${JSON.stringify(data)},\n`);
//     console.log("New data logged");
//   }, 100);
// }

// createLogger("milvus-standalone");
// createLogger("qdrant");
