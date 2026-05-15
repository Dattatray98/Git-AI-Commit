import { openai } from "./openai";
import ollama from "ollama";

const SYSTEM_PROMPT = `
You are an AI commit message generator.

Your task:
- Analyze the provided git diff summary.
- Generate ONE concise conventional commit message.
- Output ONLY the commit message.
- Do NOT explain anything.
- Do NOT use quotes.
- Do NOT use markdown.
- Do NOT add extra lines.

Rules:
- Use conventional commit format.
- Allowed types:
  feat:
  fix:
  docs:
  refactor:
  chore:
  test:
  style:

Examples:
feat: add user authentication flow
fix: resolve API response parsing issue
docs: update installation instructions
chore: update project dependencies
refactor: simplify diff parser logic

Generate a commit message based on the provided diff.
`;

export const generateCommitMessage = async (diff: string): Promise<string> => {
    // Priority check for Ollama test runtime environments
    const useOllama = process.env.AI_PROVIDER === "ollama" || process.env.OLLAMA_HOST || !process.env.OPENAI_API_KEY;

    if (useOllama) {
        try {
            const modelName = process.env.OLLAMA_MODEL || "llama3";
            
            const completion = await ollama.generate({
                model: modelName,
                prompt: `${SYSTEM_PROMPT}\n\nGit Diff:\n${diff}`,
                options: {
                    temperature: 0.1,
                }
            });

            // FIX: Grab the first element of the split array to guarantee a pure string return value
            const lines = completion.response.split('\n');
            const targetLine = lines[0] || '';

            return targetLine
                .trim()
                .replace(/^["'`]/, '')
                .replace(/["'`]$/, '');
        } catch (ollamaError) {
            console.error("Ollama execution failed:", ollamaError);
            throw ollamaError;
        }
    }

    // OpenAI Safe Fallback
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: diff }
        ],
        max_tokens: 200
    });

    return completion.choices?.[0]?.message?.content?.trim()!;
};
