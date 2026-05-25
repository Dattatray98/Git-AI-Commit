#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { getStagedDiff } from '../git_tools/diff.js';
import { filterChanges, parseDiff } from '../git_tools/parser.js';
import { checkConfigCommand, configCommand } from '../commands/config.js';
import { commitCommand } from '../commands/commit.js';
import { asistantCommand } from '../commands/assistant.js';
import { clearChatcommand } from '../commands/generalCommands.js';


const program = new Command();

program.addCommand(configCommand);
program.addCommand(checkConfigCommand);
program.addCommand(commitCommand);
program.addCommand(asistantCommand);
program.addCommand(clearChatcommand);

program
  .name('navix')
  .description('AI-powered commit message generator')
  .version('1.1.0');


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