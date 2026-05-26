import { tools } from "../core/registory.js";
import { z } from "zod";
import * as fs from "node:fs/promises"

const readfileSchema = z.object({
    filePath:z.string()
});


export const readFile:tools = {
    name:"readFile",
    description:"Use this tool to read any file in workspace",
    inputSchema: readfileSchema,
    execute: async (input:z.infer<typeof readfileSchema>)=>{
        try{
            const content = await fs.readFile(input.filePath);
            return content;
        }catch(error){
            throw error;
        }
    }
}