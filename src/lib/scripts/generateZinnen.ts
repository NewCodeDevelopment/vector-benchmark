import { faker } from "@faker-js/faker";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Fix voor ES Modules: vervang __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const aantalZinnen = 100;
const zinnen: string[] = [];

// Lijst van dieren, acties en locaties
const dieren = [
  "hond",
  "kat",
  "olifant",
  "vogel",
  "koe",
  "tijger",
  "leeuw",
  "paard",
  "aap",
  "dolfijn",
  "beer",
  "giraf",
  "konijn",
  "ezel",
  "kangoeroe",
  "pinguïn",
];
const acties = [
  "loopt",
  "springt",
  "zwemt",
  "vliegt",
  "slaapt",
  "huilt",
  "rent",
  "klimt",
  "duikt",
  "graaft",
  "sluipt",
  "slaat",
  "bijt",
  "blaft",
  "spint",
];
const locaties = [
  "in het bos",
  "bij het meer",
  "op de savanne",
  "in de tuin",
  "aan het strand",
  "in de bergen",
  "in de dierentuin",
  "op de boerderij",
  "in de stad",
  "in het park",
  "in een grot",
  "op een eiland",
  "in de sneeuw",
  "onder water",
  "boven in de bomen",
];

// Functie om de array van dieren, acties en locaties te schudden voor meer variatie
function shuffleArray(arr: string[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elementen
  }
}

shuffleArray(dieren);
shuffleArray(acties);
shuffleArray(locaties);

// Genereer 1000 zinnen met variaties van dier, actie en locatie
for (let i = 0; i < aantalZinnen; i++) {
  // Zorg ervoor dat de zinnen gevarieerd zijn door niet steeds dezelfde volgorde te gebruiken
  const dier = dieren[i % dieren.length]; // Gebruik modulus om uit de lijst van dieren te kiezen
  const actie = acties[i % acties.length]; // Gebruik modulus om uit de lijst van acties te kiezen
  const locatie = locaties[i % locaties.length]; // Gebruik modulus voor locaties

  // Voeg de gegenereerde zin toe aan de array
  zinnen.push(`Een ${dier} ${actie} ${locatie}.`);
}

const content = `export const zinnen = ${JSON.stringify(zinnen, null, 2)};\n`;
const outputPath = resolve(__dirname, "../data/data.ts");

fs.writeFileSync(outputPath, content, "utf-8");

console.log(`✅ ${aantalZinnen} zinnen opgeslagen in data.ts`);
