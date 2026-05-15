#!/usr/bin/env bun

import { Command } from 'commander';
import chalk from 'chalk';
import { getStagedDiff } from './git/diff';
import { filterChanges, parseDiff } from './git/parser';
import { generatePrompt } from './utils/formatter';
import { validateConfig } from './config';
import dotenv, { config } from "dotenv";
import { generateCommitMessage } from './ai/generator';
dotenv.config();

const program = new Command();

program
  .name('git-ai-commit')
  .description('AI-powered commit message generator')
  .version('1.0.0');


program
  .command("hello")
  .description("says hello")
  .action(() => {
    console.log(chalk.green('Hello world'));
    console.log(chalk.gray('This is styled text'));
  });


program
  .command("diff")
  .description("shows git diff")
  .action(async () => {
    const stdout = await getStagedDiff();
    console.log(stdout);
  });


program
  .command('generate')
  .description("shows the prased file chnage difference")
  .action(async () => {

    // if (!diff) {
      //   console.log(chalk.red("No staged changes found. Did you forget to git add?"));
      //   process.exit(1);
      // }
      // if (changes.length === 0) {
      //   console.log(chalk.red("only ignored files found."));
      //   process.exit(1);
      // }
  
      // console.log(chalk.gray(prompt));
  
  
      validateConfig();
      const diff = await getStagedDiff();
      const changes = filterChanges(parseDiff(diff))
      const prompt = generatePrompt(changes);
      const GeneratedCommit = await generateCommitMessage(prompt);
      
      console.log('Proposed Commit Message:');
      console.log(GeneratedCommit);

  });

program.parse(process.argv);