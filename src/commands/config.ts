import { Command } from "commander";
import { setupConfig } from "../config/setup";

const configCommand = new Command("config")
    .description("Configure Navix AI provider and model")
    .option("--provider <provider>", "AI provider")
    .option("--model <model>", "Model name")
    .action(async (options) => {
        const { provider, model } = options;
        await setupConfig(provider, model);
    })
export default configCommand;