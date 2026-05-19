import { loadConfig } from "../config/config";
import { Command } from "commander";
import { getStagedDiff } from "../git_tools/diff";
import chalk from "chalk";
import { filterChanges, parseDiff } from "../git_tools/parser";
import { generateCommitMessage } from "../models";
import { formateDiff } from "../utils/formatter";
import { GitCommit } from "../git_tools/commit";


export const commitCommand = new Command("commit")
    .description("generates the commit message")
    .action(async () => {
        const diff = await getStagedDiff();

        if (!diff) {
            console.log(chalk.yellow("no staged chnages found! first try 'git add .' or 'git add ./filename' "));
            process.exit(1);
        }

        const changes = filterChanges(parseDiff(diff));
        const prompt = formateDiff(changes)
        const message = await generateCommitMessage(prompt)

        if (!message) {
            console.log(chalk.red("Error while generating message!"));
            process.exit(1);
        }

        console.log(chalk.yellow('Proposed Commit Message:'));
        console.log(message + "\n");

        const commitRes = await GitCommit(message)

        console.log(commitRes)
    })
