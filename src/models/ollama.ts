import ollama from "ollama";

export const generateWithOllama = async (diff: string, model: string) => {
    try {
        const response = await ollama.generate({
            model: model,
            prompt: diff
        });

        return response.response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}