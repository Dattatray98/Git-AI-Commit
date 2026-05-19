#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { getStagedDiff } from '../git_tools/diff';
import { filterChanges, parseDiff } from '../git_tools/parser';
import { checkConfigCommand, configCommand } from '../commands/config';
import { commitCommand } from '../commands/commit';


const program = new Command();

program.addCommand(configCommand);
program.addCommand(checkConfigCommand);
program.addCommand(commitCommand)

program
  .name('navix')
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


program.parse(process.argv);