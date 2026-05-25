import OpenAI from "openai";
import { SYSTEM_PROMPT } from "../utils/prompt";


export const generateWithOpenAI = async (diff: string, model: string) => {
    try {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error(
                "OPENAI_API_KEY is missing"
            );
        }

        if (!diff) {
            throw new Error("staged diff is missing!");
        }

        if (!model) {
            throw new Error("model name is missing!");
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const response = await openai.chat.completions.create({
            model,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: diff }
            ]
        });


        const message = response.choices[0].message.content;
        if (!message) {
            throw new Error("No response recieved from openai");
        }

        return message;

    } catch (error: any) {
        console.error(error);
        throw error;
    }
}