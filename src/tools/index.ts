import { registerTool } from "../core/registory.js";
import { readFile } from "./readFile.js";
import { SearchWorkspace } from "./search_workspace.js";

registerTool(SearchWorkspace);
registerTool(readFile);
