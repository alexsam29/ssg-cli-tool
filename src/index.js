const yargs = require("yargs");
const chalk = require("chalk");
const { version } = require("../package.json");
const { name } = require("../package.json");
const { author } = require("../package.json");
const ssg = require("./ssgStart");

module.exports.main = function main() {
    // Create CLI arguments
    const options = yargs
        .usage("Usage: -i <input>")
        .help("help")
        .alias("help", "h")
        .version(
            chalk.bold(`\nName: ${name}\nVersion: ${version}\nAuthor: ${author}\n`)
        )
        .alias("version", "v")
        .option("i", {
            alias: "input",
            describe: "File name",
            type: "string",
        })
        .option("o", {
            alias: "output",
            describe: "Specify a different output directory",
            type: "string",
        })
        .option("l", {
            alias: "lang",
            describe: "HTML language code for resulting HTML file(s)",
            type: "string",
        })
        .option("c", {
            alias: "config",
            describe: "Specify a JSON config file to use",
            type: "string",
        }).argv;

    ssg.ssgStart(options);
};
