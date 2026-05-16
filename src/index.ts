#!/usr/bin/env bun

import { Command } from 'commander';
import chalk from 'chalk';
import { getStagedDiff } from './git/diff';
import { filterChanges, parseDiff } from './git/parser';
import { generatePrompt } from './utils/formatter';
import { validateConfig } from './config';
import dotenv, { config } from "dotenv";
import { generateCommitMessage } from './Ai/generator';
import { GitCommit } from './git/commit';
dotenv.config();

const program = new Command();

program
  .name('git-ai-commit')
  .description('AI-powered commit message generator')
  .version('1.0.0');


program
  .command("diff")
  .description("shows git diff")
  .action(async () => {
    const stdout = await getStagedDiff();
    console.log(stdout);
  });


program
  .command("aicommit")
  .description("shows the prased file chnage difference")
  .action(async()=>{
    validateConfig();
    const diff = await getStagedDiff();
    const changes = filterChanges(parseDiff(diff));
    const prompt = generatePrompt(changes);
    const message = await generateCommitMessage(prompt);

    console.log(chalk.yellow('Proposed Commit Message:'));
    console.log(message + "\n");

    const commitRes = await GitCommit(message);
    console.log(chalk.green.bold("commited following, Now push your changes!"));
    console.log(commitRes);
  });



program.parse(process.argv);