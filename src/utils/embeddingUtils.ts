export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    throw new Error("Vectors must be non-empty and of equal length");
  }

  const dotProduct = vecA.reduce((sum, a, i) => {
    const b = vecB[i];
    if (b === undefined) throw new Error(`vecB[${i}] is undefined`);
    return sum + a * b;
  }, 0);

  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  return dotProduct / (magnitudeA * magnitudeB);
};

export interface Material {
  content?: string | null;
  embedding?: number[] | null;
}


export const findRelevantChunks = (
  queryEmbedding: number[],
  materials: Material[]
): string[] => {
  const scored = materials
    .map((m) => {
      if (!m?.embedding || !m?.content) return null;
      return {
        text: m.content,
        score: cosineSimilarity(queryEmbedding, m.embedding),
      };
    })
    .filter((item): item is { text: string; score: number } => item !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.text);

  return scored;
};

export const findRelevantChunksByKeywords = (query: string, materials: Material[]): string[] => {
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  const relevantChunks: string[] = [];

  materials.forEach(material => {
    if (!material.content) return;
    const content = material.content.toLowerCase();
    const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim().length > 10);

    sentences.forEach((sentence: string) => {
      const matchCount = queryWords.reduce((count, word) => {
        return count + (sentence.includes(word) ? 1 : 0);
      }, 0);

      if (matchCount > 0) {
        relevantChunks.push(sentence.trim());
      }
    });
  });

  // Return top 5 relevant chunks
  return relevantChunks.slice(0, 5);
};
