import { Command } from "commander";
import { setupConfig } from "../config/setup.js";
import { loadConfig } from "../config/config.js";

export const configCommand = new Command("config")
    .description("Configure Navix AI provider and model")
    .option("--provider <provider>", "AI provider")
    .option("--model <model>", "Model name")
    .action(async (options) => {
        try {
            const { provider, model } = options;
            await setupConfig(provider, model);
        } catch (error) {
            console.error(error);
        }
    })


export const checkConfigCommand = new Command("check-config")
    .description("check the AI provider name and model name")
    .action(async () => {
        try {
            const config = await loadConfig();
            if (!config) {
                console.log("config is missing!");
            }
            console.log(config)
        } catch (error) {
            console.error(error)
        }
    })

