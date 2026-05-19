import chalk from "chalk";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import { NavixConfig } from "../types/config";




const homedir = os.homedir()

const configDirPath = path.join(homedir, '.navix');


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

// export const config = {
//     OPENAI_API_KEY: process.env.OPENAI_API_KEY
// };


// export const validateConfig = () => {
//     if (!config.OPENAI_API_KEY) {
//         console.log(chalk.yellow("OpenAI API key not found."))
//         console.log(chalk.white("Set it using:"))
//         console.log(chalk.green("Windows:"))
//         console.log(chalk.gray('setx OPENAI_API_KEY "your-key"'))
//         console.log(chalk.green("Mac/Linux:"))
//         console.log(chalk.gray('export OPENAI_API_KEY="your-key"'))
//         process.exit(1);
//     }
// }