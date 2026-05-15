import { openai } from "./openai";
import ollama from "ollama";

const SYSTEM_PROMPT = `You are a specialized commit message generator. Write a concise, conventional commit message based on the provided diff. without any single extra character, and also don't tell what you did, i want only the commit message line only. `;

export const generateCommitMessage = async (diff: string): Promise<string> =>{
    try{
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content:SYSTEM_PROMPT},
                {role: "user", content:diff}
            ],
            max_tokens:200
        });
    
        return completion.choices[0].message.content || 'Error: No message generated';
    }catch(error){
        const completion = await ollama.generate({
            model:"llama3",
            prompt:`system : ${SYSTEM_PROMPT}, user : ${diff}`
        });

        return completion.response;
    }
}
