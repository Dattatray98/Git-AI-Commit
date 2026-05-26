import { SemanticIndex } from "../core/registory.js";
import { createEmbeddings } from "../models/embeddings.js";



const cosineSimilarity = (vecA: number[], vecB: number[]) => {
    try {

        if (vecA.length !== vecB.length) {
            throw new Error(
                'Vector dimentions do not match'
            );
        }

        let docProduct = 0;
        let normA = 0;
        let normB = 0;


        for (let i = 0; i < vecA.length; i++) {
            docProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        return docProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const findRelavantTool = async (query: string, topk: number = 5) => {
    try {
        const inputEm = await createEmbeddings(query);
        const score: { tool: string, score: number }[] = [];

        for (const [toolname, toolEmbeddings] of SemanticIndex) {
            const similarity = cosineSimilarity(inputEm, toolEmbeddings);
            score.push({ tool: toolname, score: similarity });
        }

        score.sort((a, b) => b.score - a.score);

        return score.slice(0, topk);

    } catch (error) {
        console.error(error);
        throw error;
    }
}
