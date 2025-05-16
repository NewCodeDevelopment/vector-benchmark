import { exec } from "child_process";

export async function getDockerStats(containerName: string) {
  return new Promise((resolve, reject) => {
    exec(
      `docker stats --no-stream --format "{{.Name}}: {{.MemUsage}}" ${containerName}`,
      (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${stderr}`);
        }
        resolve(stdout.trim());
      }
    );
  });
}
