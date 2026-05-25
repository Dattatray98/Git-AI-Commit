import { loadConfig } from "../config/config"
import { Ollama_Model } from "./ollama";
import { generateWithOpenAI } from "./openai";



export const generateWith = async (prompt: string): Promise<string> => {
    console.log(prompt)
    try {
        if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
            throw new Error("stages are missing!");
        }

        const config = await loadConfig();
        if (!config || !config.model || !config.provider) {
            throw new Error("Configuration is missing");
        }

        let res;

        if (config?.provider === "openai") {
            res = await generateWithOpenAI(prompt, config.model);
        } else if (config.provider === "ollama") {
            res = await Ollama_Model(prompt, config.model)
        } else {
            throw new Error(`Unsupported provider : ${config.provider}`);
        }

        if (!res) {
            throw new Error("Failed to generate commit message");
        }

        return res;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
