#!/usr/bin/env node
const yargs = require("yargs");

const options = yargs.usage("Usage: -n <name>").option("n", {
  alias: "name",
  describe: "Your name",
  type: "string",
  demandOption: true,
}).argv;

const output = `Hello, ${options.name}!`;

console.log(output);
