import React from "react";
import { Command } from "commander";
import { render } from "ink";
import { App } from "../ui/App.js";
import { randomUUID } from "node:crypto";
import { isInitilized } from "../setup/state.js";
import { initializeNavix } from "../setup/init.js";
import { initilizeTools } from "../tools/index.js";

export const asistantCommand = new Command("wake-up")
    .description("wakes the navix assistant.")
    .action(async () => {
        try {
            await initilizeTools();
            const initialized = await isInitilized();
            if (!initialized) {
                await initializeNavix();
            }else{
                console.log("initilized")
            }

            const chat_Id = randomUUID();
            render(<App chat_Id={chat_Id} />);

        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    })