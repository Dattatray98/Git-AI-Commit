import { json, z } from "zod";
import { createEmbeddings } from "../models/embeddings.js";

const ToolSchema = z.object({
    name: z.string(),
    description: z.string(),
    inputSchema: z.any(),
    execute: z.function({
        input: [z.any()],
        output: z.promise(z.any())
    })
})

export type tools = z.infer<typeof ToolSchema>;

export const LocalToolRegistry: Map<string, tools> = new Map();
export const SemanticIndex: Map<string, number[]> = new Map();

export const registerTool = async (tool: tools) => {
    ToolSchema.parse(tool)

    if (LocalToolRegistry.has(tool.name)) {
        throw new Error(
            `Tool "${tool.name}" is already registered!`
        );
    }
    LocalToolRegistry.set(tool.name, tool);

    const result = await createEmbeddings(tool.description);   // for now will only create description embeddings only
    SemanticIndex.set(tool.name, result);

    console.log(`tool [${tool.name}] registered locally`);
}



export const executeTool = async (input: string) => {
    try {
        const cleanedInput = input.trim();
        if (!cleanedInput) {
            throw new Error(
                'the input is invalid, check the tool defination structure'
            );
        }

        const JsonInput = JSON.parse(cleanedInput);

        const tool = LocalToolRegistry.get(JsonInput.name);

        if (!tool) {
            throw new Error(
                `Tool "${JsonInput.name}" not found`
            );
        }

        const parsedInput = tool.inputSchema.parse(JsonInput.input);

        const result = await tool.execute(parsedInput);

        return {
            success: true,
            tool: tool.name,
            result
        };

    } catch (error) {
        console.error(error);

        return {
            success: false,
            error: error instanceof Error
                ? error.message
                : "Unknown error"
        };
    }
}