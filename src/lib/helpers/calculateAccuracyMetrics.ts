export function calculateAccuracyMetrics(
  results: any[],
  groundTruth: string[],
  isQdrant = false
) {
  // Extract IDs or names from results based on database type
  const retrievedItems = results.map((item: any) => {
    if (isQdrant) {
      // Voor Qdrant resultaten
      return item.payload?.name || String(item.id);
    } else {
      // Voor Milvus resultaten
      return item.naam || String(item.id);
    }
  });

  console.log("Retrieved items:", retrievedItems);
  console.log("Ground truth:", groundTruth);

  // Calculate precision@k metrics
  const precision = {
    p1: calculatePrecisionAtK(retrievedItems, groundTruth, 1),
    p3: calculatePrecisionAtK(retrievedItems, groundTruth, 3),
    p5: calculatePrecisionAtK(retrievedItems, groundTruth, 5),
    p10: calculatePrecisionAtK(retrievedItems, groundTruth, 10),
  };

  // Calculate Mean Reciprocal Rank (MRR)
  const mrr = calculateMRR(retrievedItems, groundTruth);

  // Calculate Mean Average Precision (MAP)
  const map = calculateMAP(retrievedItems, groundTruth);

  return {
    precision,
    mrr,
    map,
  };
}
// Calculate Precision@K
function calculatePrecisionAtK(
  retrievedItems: string[],
  groundTruth: string[],
  k: number
) {
  // Bescherm tegen lege arrays of k groter dan de array
  if (!retrievedItems.length || k <= 0) return 0;

  const topK = retrievedItems.slice(0, k);

  // Tel hoeveel items in topK voorkomen in groundTruth
  // Gebruik case-insensitive vergelijking en string.includes voor partial matches
  const relevantCount = topK.filter((item) =>
    groundTruth.some(
      (truth) =>
        item.toLowerCase().includes(truth.toLowerCase()) ||
        truth.toLowerCase().includes(item.toLowerCase())
    )
  ).length;

  console.log("Relevant count:", relevantCount);

  return relevantCount / k;
}

// Calculate Mean Reciprocal Rank (MRR)
function calculateMRR(retrievedItems: string[], groundTruth: string[]) {
  for (let i = 0; i < retrievedItems.length; i++) {
    // Gebruik case-insensitive vergelijking en partial matches
    if (
      groundTruth.some(
        (truth) =>
          retrievedItems[i].toLowerCase().includes(truth.toLowerCase()) ||
          truth.toLowerCase().includes(retrievedItems[i].toLowerCase())
      )
    ) {
      return 1 / (i + 1);
    }
  }
  return 0;
}

// Calculate Mean Average Precision (MAP)
function calculateMAP(retrievedItems: string[], groundTruth: string[]) {
  let relevantCount = 0;
  let sumPrecision = 0;

  for (let i = 0; i < retrievedItems.length; i++) {
    // Gebruik case-insensitive vergelijking en partial matches
    const isRelevant = groundTruth.some(
      (truth) =>
        retrievedItems[i].toLowerCase().includes(truth.toLowerCase()) ||
        truth.toLowerCase().includes(retrievedItems[i].toLowerCase())
    );

    if (isRelevant) {
      relevantCount++;
      sumPrecision += relevantCount / (i + 1);
    }
  }

  return relevantCount > 0 ? sumPrecision / groundTruth.length : 0;
}
