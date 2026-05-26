import * as fs from "node:fs/promises";
import * as path from "node:path";
import { configDirPath } from "../config/config.js";



export const directories = {
    root: configDirPath,
    models: path.join(configDirPath, "models"),
    cache: path.join(configDirPath, "cache"),
    embeddings: path.join(configDirPath, "embeddings"),
    memory: path.join(configDirPath, "memory")
};


export const createDirectories = async () => {
    try {
        for (const dir of Object.values(directories)) {
            await fs.mkdir(dir, { recursive: true });
        }
    } catch (error) {
        console.log(error)
    }
}