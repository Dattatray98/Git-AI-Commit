import { Command } from "commander";
import * as readlines from "readline/promises";
import { generateWith } from "../models";


const rl = readlines.createInterface({
    input: process.stdin,
    output: process.stdout
});


export const asistantCommand = new Command("wake-up")
    .description("wakes the navix assistant.")
    .action(async () => {
        try {
            while(true){
                const input = await rl.question("You : ")
                const cleaned_input = input.trim()
                if(cleaned_input === "exit()"){
                    process.exit(1);
                }
                const res = await generateWith(cleaned_input)
                console.log("\n" + res )
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    })