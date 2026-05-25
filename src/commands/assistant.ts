import { Command } from "commander";
import * as readlines from "readline/promises";
import { generateWith } from "../models";
import { randomUUID } from "crypto";
import { initialize_database, insert_message } from "../memory/chat_memory";


const rl = readlines.createInterface({
    input: process.stdin,
    output: process.stdout
});

export const asistantCommand = new Command("wake-up")
    .description("wakes the navix assistant.")
    .action(async () => {
        try {
            const chat_id = randomUUID();
            await initialize_database();
            console.log("Navix Assistant is awake. Type 'exit()' to leave.\n");
            while (true) {
                const input = await rl.question("\nYou : ")
                const cleaned_input = input.trim()
                if (cleaned_input === "exit()") {
                    process.exit(1);
                }
                const message_Id = randomUUID();
                const res = generateWith(cleaned_input)

                let full_response = "";
                for await (const chunk of res){
                    full_response += chunk;
                    process.stdout.write(chunk);
                }

                console.log();

                await insert_message(message_Id, chat_id, cleaned_input, full_response);
            }
        } catch (error) {
            console.log(error);
            rl.close();
            process.exit(1);
        }
    })