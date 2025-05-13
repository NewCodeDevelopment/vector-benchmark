export function calculateAccuracyMetrics(
  results: any[],
  groundTruth: string[],
  isQdrant = false
) {
  const retrievedItems = results.map((item: any) =>
    isQdrant ? item.payload?.name : item.naam
  );

  // Is eerste resultaat relevant?
  // Hoeveel van de eerste 3 resultaten zijn relevant?
  // ...
  const precision = {
    p1: calculatePrecisionAtK(retrievedItems, groundTruth, 1),
    p3: calculatePrecisionAtK(retrievedItems, groundTruth, 3),
    p5: calculatePrecisionAtK(retrievedItems, groundTruth, 5),
    p10: calculatePrecisionAtK(retrievedItems, groundTruth, 10),
  };

  return {
    precision,
    mrr: calculateMRR(retrievedItems, groundTruth),
    ap: calculateAP(retrievedItems, groundTruth),
  };
}

function isRelevant(item: string, groundTruth: string[]) {
  return groundTruth.some(
    (truth) =>
      item.toLowerCase().includes(truth.toLowerCase()) ||
      truth.toLowerCase().includes(item.toLowerCase())
  );
}

function calculatePrecisionAtK(
  retrievedItems: string[],
  groundTruth: string[],
  k: number
) {
  if (!retrievedItems.length || k <= 0) return 0;

  const topK = retrievedItems.slice(0, k);

  // Tel hoeveel items in topK voorkomen in groundTruth
  // Gebruik case-insensitive vergelijking en string.includes voor partial matches
  // const relevantCount = topK.filter((item) =>
  //   groundTruth.some(
  //     (truth) =>
  //       item.toLowerCase().includes(truth.toLowerCase()) ||
  //       truth.toLowerCase().includes(item.toLowerCase())
  //   )
  // ).length;
  const relevantCount = topK.filter((item) =>
    isRelevant(item, groundTruth)
  ).length;

  return relevantCount / k;
}

function calculateMRR(retrievedItems: string[], groundTruth: string[]) {
  for (let i = 0; i < retrievedItems.length; i++) {
    // if (
    //   groundTruth.some(
    //     (truth) =>
    //       retrievedItems[i].toLowerCase().includes(truth.toLowerCase()) ||
    //       truth.toLowerCase().includes(retrievedItems[i].toLowerCase())
    //   )
    // ) {
    //   return 1 / (i + 1);
    // }
    if (isRelevant(retrievedItems[i], groundTruth)) {
      return 1 / (i + 1);
    }
  }
  return 0;
}

function calculateAP(retrievedItems: string[], groundTruth: string[]) {
  let relevantCount = 0;
  let sumPrecision = 0;

  for (let i = 0; i < retrievedItems.length; i++) {
    if (isRelevant(retrievedItems[i], groundTruth)) {
      relevantCount++;
      sumPrecision += relevantCount / (i + 1);
    }
  }

  return relevantCount > 0 ? sumPrecision / groundTruth.length : 0;
  // const isRelevant = groundTruth.some(
  //   (truth) =>
  //     retrievedItems[i].toLowerCase().includes(truth.toLowerCase()) ||
  //     truth.toLowerCase().includes(retrievedItems[i].toLowerCase())
  // );

  // if (isRelevant) {
  //   relevantCount++;
  //   sumPrecision += relevantCount / (i + 1);
  // }
  // return relevantCount > 0 ? sumPrecision / groundTruth.length : 0;
}
