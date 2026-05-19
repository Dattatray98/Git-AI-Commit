#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { getStagedDiff } from '../git_tools/diff';
import { filterChanges, parseDiff } from '../git_tools/parser';
import { generatePrompt } from '../utils/formatter';
import { validateConfig } from '../config';
import dotenv from "dotenv";
import { generateCommitMessage } from '../ai_models/generator';
import { GitCommit } from '../git_tools/commit';
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
    const diff = await getStagedDiff();
    if (!diff) {
      console.log(chalk.yellow("no staged changes found! first try 'git add .' or 'git add ./filename'"));
      process.exit(1);
    }
    console.log(diff);
  });


program
  .command("filter-diff")
  .description("show the filtered diff.")
  .action(async () => {
    const diff = await getStagedDiff();
    if (!diff) {
      console.log(chalk.yellow("no staged changes found! first try 'git add .' or 'git add ./filename'"));
      process.exit(1);
    }

    const changes = filterChanges(parseDiff(diff));
    console.log(chalk.yellow(`filter changes : `))
    console.log(changes)
  })


program
  .command("aicommit")
  .description("shows the prased file chnage difference")
  .action(async () => {
    validateConfig();
    const diff = await getStagedDiff();
    if (!diff) {
      console.log(chalk.yellow("no staged chnages found! first try 'git add .' or 'git add ./filename' "));
      process.exit(1);
    }
    const changes = filterChanges(parseDiff(diff));
    const prompt = generatePrompt(changes);
    const message = await generateCommitMessage(prompt);

    if(!message){
      console.log(chalk.red("Error while generating message!"));
      process.exit(1);
    }
    
    console.log(chalk.yellow('Proposed Commit Message:'));
    console.log(message + "\n");

    const commitRes = await GitCommit(message);
    console.log(chalk.green.bold("commited following, Now push your changes!"));
    console.log(commitRes);
  });



program.parse(process.argv);