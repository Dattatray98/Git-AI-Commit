import React from "react";
import { Command } from "commander";
import { render } from "ink";
import { App } from "../ui/App.js";
import { randomUUID } from "node:crypto";

export const asistantCommand = new Command("wake-up")
    .description("wakes the navix assistant.")
    .action(async () => {
        try {
            const chat_Id = randomUUID();
            render(<App chat_Id={chat_Id} />);

        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    })