import { pipeline, env } from "@huggingface/transformers";
import { directories } from "../setup/directories.js";


env.cacheDir = directories.models;

export const createEmbeddings = async (input: string) => {
    try {

        const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
        const embeddings = await extractor(input, { pooling: "mean", normalize: true });

        return Array.from(
            embeddings.data
        );

    } catch (error) {
        console.error(error);
        throw error;
    }
}