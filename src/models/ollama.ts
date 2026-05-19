import ollama from "ollama";
import { SYSTEM_PROMPT } from "../utils/prompt";

export const generateWithOllama = async (diff: string, model: string) => {
    try {
        console.log("diff : ", diff + "\n\n model : ", model)
        const response = await ollama.chat({
            model: model,
            messages:[
                {role:"system", content:SYSTEM_PROMPT},
                {role:"user", content:diff}
            ]
        });

        return response.message.content;
    } catch (error) {
        console.log(error);
        throw error;
    }
}