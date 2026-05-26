import glob from "fast-glob";
import * as fs from "node:fs/promises";
import { registerTool, tools } from "../core/registory.js";
import { string, z } from "zod";

const searchSchema = z.object({
    fileName: z.string()
});

export const SearchWorkspace: tools = {
    name: "searchWorkspace",
    description: "use tool to serach files and folders in workspace",
    inputSchema: searchSchema,
    execute: async (input: z.infer<typeof searchSchema>) => {
        try {
            const file = await glob(`**/${input.fileName}`, { ignore: ['node_modules/**', ".git/**", '.vscode/**', 'dist/**'], absolute: true });
            return file;
        } catch (error) {
            throw error;
        }
    }
}