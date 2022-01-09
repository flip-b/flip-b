#!/usr/bin/env node

import tar from 'tar';
import fs from 'fs';
import path from 'path';
import https from 'https';
import prompts from 'prompts';
import { Command } from 'commander';

(async () => {
  const packageJson = await import(path.resolve(`./package`));
  const options: any = {
    type: '',
    name: ''
  };

  const program = new Command(packageJson.name)
    .version(packageJson.version)
    .arguments('[type] [name]')
    .action((type: string, name: string) => {
      options.type = `${type || ''}`.trim();
      options.name = `${name || ''}`.trim();
    })
    .parse(process.argv);

  if (!options.type) {
    const prompt = await prompts({
      type: 'text',
      name: 'type',
      message: 'What is your project type?',
      initial: 'app'
    });
    options.type = `${prompt.type || ''}`.trim();
  }

  if (!options.name) {
    const prompt = await prompts({
      type: 'text',
      name: 'name',
      message: 'What is your project name?',
      initial: `my-${options.type}`
    });
    options.name = `${prompt.name || ''}`.trim();
  }

  if (!options.type || !options.name) {
    console.log(`Invalid parameters.`);
    console.log(`Run ${program.name()} --help to see all options.`);
    process.exit(1);
  }

  console.log(`Creating a new Flip-B project.`);
  const root = path.resolve(options.name);
  fs.mkdirSync(root);
  process.chdir(root);

  const url = `https://codeload.github.com/flip-b/flip-b/tar.gz/main`;
  const dir = `flip-b-main/examples/flip-b-{$options.type}`;

  https.get(url, (res: any) => {
    res.pipe(tar.extract({ cwd: root, strip: dir.split('/').length }, [dir]));
    console.log(`Success!`);
  });
})();
