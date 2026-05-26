import chalk from "chalk";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import { NavixConfig } from "../types/config.js";




const homedir = os.homedir()

export const configDirPath = path.join(homedir, '.navix');

const configFilePath = path.join(configDirPath, "config.json");


export const loadConfig = async (): Promise<NavixConfig | null> => {
    try {
        const rawdata = await fs.readFile(configFilePath, "utf-8");
        return JSON.parse(rawdata);

    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return null;
        }

        // Optional: Handle invalid JSON syntax errors explicitly
        if (error.name === "SyntaxError") {
            console.error('Config file contains invalid JSON syntax.');
        }

        throw error;
    }
}


export const saveConfig = async (config: NavixConfig): Promise<void> => {
    try {
        await fs.mkdir(configDirPath, { recursive: true });
        const jsonstring = JSON.stringify(config, null, 2);

        await fs.writeFile(configFilePath, jsonstring, 'utf-8');

    } catch (error) {
        console.error('Failed to save configuration:', error);
        throw error;
    }
}
