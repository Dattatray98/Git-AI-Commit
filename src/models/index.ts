import { loadConfig } from "../config/config.js";
import { findRelavantTool } from "../utils/semanticSearch.js";
import { Ollama_Model } from "./ollama.js";
import { generateWithOpenAI } from "./openai.js";
import { GenerateResponse } from "ollama"; // 1. Import the type

export const generateWith = async function* (prompt: string): AsyncGenerator<string> {
    try {
        if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
            throw new Error("stages are missing!");
        }
        console.log(prompt)
        
        const config = await loadConfig();
        if (!config || !config.model || !config.provider) {
            throw new Error("Configuration is missing");
        }
        

        if (config?.provider.toLowerCase() === "openai") {
            // Handle OpenAI streaming here if needed
            const openAiRes = await generateWithOpenAI(prompt, config.model);
            // Example if openAiRes yields strings directly:
            for await (const chunk of openAiRes) {
                yield chunk;
            }
            return;
        }



        if (config.provider.toLowerCase() === "ollama") {
            // 2. Explicitly type the Ollama stream response
            const res: AsyncIterable<GenerateResponse> = await Ollama_Model(prompt, config.model);

            if (!res) {
                throw new Error("Failed to generate commit message");
            }

            // 3. TypeScript now knows 'part' safely has the 'response' property
            for await (const part of res) {
                yield part.response;
            }
            return;
        }

        throw new Error(`Unsupported provider : ${config.provider}`);

    } catch (error) {
        console.error(error);
        throw error;
    }
}
