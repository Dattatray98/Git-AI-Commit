import { pipeline, env } from "@huggingface/transformers";
import { directories } from "./directories.js";

export const initializeModels = async ()=>{
    env.cacheDir = directories.models;

    await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
}