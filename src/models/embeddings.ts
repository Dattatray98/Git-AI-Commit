import { pipeline, env } from "@huggingface/transformers";
import { configDirPath } from "../config/config.js";
import * as path from "node:path";
import * as fs from "node:fs/promises";

const modelPath = path.join(configDirPath, "Xenova/models");
await fs.mkdir(modelPath, { recursive: true });
env.cacheDir = modelPath;

const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

export const createEmbeddings = async (input: string) => {
    try {

        const embeddings = await extractor(input, { pooling: "mean", normalize: true });

        return Array.from(
            embeddings.data
        );
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}