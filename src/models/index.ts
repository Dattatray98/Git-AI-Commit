import { loadConfig } from "../config/config"
import { SYSTEM_PROMPT } from "../utils/prompt";
import { generateWithOllama } from "./ollama";



export const generateCommitMessage = async (diff: string) => {
    if (!diff || typeof diff !== 'string' || diff.trim() === '') {
        return "chore: minor repository updates";
    }

    const context = `system : ${SYSTEM_PROMPT}, diff : ${diff}`

    const config = await loadConfig();
    if (!config) {
        console.log("config is missing!")
    }

    const res = await generateWithOllama(context, config?.model!)

    if (!res) {
        console.log("response not received")
    }
    console.log(res)
}
