#!/usr/bin/env node
const yargs = require("yargs");

const options = yargs.usage("Usage: -i <input>").option("i", {
  alias: "input",
  describe: "File name",
  type: "string",
  demandOption: true,
}).argv;

const output = `This is the file name you chose, ${options.input}!`;

console.log(output);

const fs = require("fs");
fs.readFile(options.input, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data.toString());
});
