import ollama from "ollama";

export const Ollama_Model = async (prompt: string, model: string) => {
    try {

        if (!prompt) {
            throw new Error("staged diff is missing!");
        }

        if (!model) {
            throw new Error("model name is missing!");
        }

        const response = await ollama.generate({
            model: model,
            prompt:prompt,
            stream:true
        });

        const message = response
        if(!message){
            throw new Error("No response recieved from ollama")
        }
        return message;
        
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}