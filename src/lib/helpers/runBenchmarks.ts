import { generateHtmlReport } from "./generateHtmlReport";
import { searchInMilvus } from "./searchInMilvus";
import { searchInQdrant } from "./searchInQdrant";

const query = "Een leeuw vliegt in de bergen.";

async function runBenchmarks() {
  const { default: Benchmark } = await import("benchmark");
  const suite = new Benchmark.Suite();

  suite
    .add("Milvus Search", {
      defer: true,
      fn: async (deferred: any) => {
        await searchInMilvus(query);
        deferred.resolve();
      },
    })
    .add("Qdrant Search", {
      defer: true,
      fn: async (deferred: any) => {
        await searchInQdrant(query);
        deferred.resolve();
      },
    })
    .on("cycle", (event: any) => {
      console.log("ITERATIES", String(event.target));
    })
    .on("complete", function (this: any) {
      const results = this.map((b: any) => ({
        name: b.name,
        hz: b.hz,
      }));

      generateHtmlReport(results);
    })
    .run({
      async: true,
      minSamples: 10,
      maxTime: 0.5, // verkort testduur zodat beide vergelijkbaar blijven
    });
}

runBenchmarks();
