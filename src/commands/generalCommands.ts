import { Command } from "commander";
import { clearChats } from "../memory/chat_memory.js";
import chalk from "chalk";



export const clearChatcommand = new Command("clear-chats")
    .description("Clears all the chats history.")
    .action(async () => {
        try {
            const res = await clearChats();
            console.log(chalk.yellow(res));
            process.exit(1);
        } catch (error: any) {
            console.log(error);
        }
    });


