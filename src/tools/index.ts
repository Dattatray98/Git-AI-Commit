import { registerTool } from "../core/registory.js";
import { readFile } from "./readFile.js";
import { SearchWorkspace } from "./search_workspace.js";



export const initilizeTools = async ()=>{
    try{
        await registerTool(SearchWorkspace);
        await registerTool(readFile);

    }catch(error){
        throw error;
    }
}
