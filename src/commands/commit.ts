import { Command } from "commander";
import { getStagedDiff } from "../git_tools/diff";
import chalk from "chalk";
import { filterChanges, parseDiff } from "../git_tools/parser";
import { generateWith } from "../models";
import { formateDiff } from "../utils/formatter";
import { GitCommit } from "../git_tools/commit";
import { SYSTEM_PROMPT } from "../utils/prompt";


export const commitCommand = new Command("commit")
    .description("generates the commit message")
    .action(async () => {
        try {
            const diff = await getStagedDiff();

            if (!diff) {
                console.log(chalk.yellow("no staged chnages found! first try 'git add .' or 'git add ./filename' "));
                process.exit(1);
            }

            const changes = filterChanges(parseDiff(diff));
            const prompt = formateDiff(changes)

            const full_prompt = `System : ${SYSTEM_PROMPT}, User : ${prompt}`

            const res = await generateWith(full_prompt)
            let message = "";
            for await (const chunk of res) {
                message += chunk;
            }

            if (!message) {
                console.log(chalk.red("Error while generating message!"));
                process.exit(1);
            }

            console.log(chalk.yellow('Proposed Commit Message:'));
            console.log(chalk.green(message) + "\n");

            const commitRes = await GitCommit(message)

            console.log(commitRes)

            process.exit(1);

        } catch (error: any) {
            console.error(error)
            throw error;
        }
    })
