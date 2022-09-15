#!/usr/bin/env node
const yargs = require("yargs");
const path = require("path");
const fs = require("fs");
const createHTML = require("create-html");
const chalk = require("chalk");
const { version } = require("../package.json");
const { name } = require("../package.json");
const { author } = require("../package.json");

// Get CLI arguments
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
        demandOption: true,
    })
    .option("o", {
        alias: "output",
        describe: "Specify a different output directory",
        type: "string",
    }).argv;

// Output file name
const output = `Path of file or folder: ${options.input}`;
console.log(chalk.bgWhite(output));

// Create Directory
var dir;
if (options.output) {
    dir = options.output;
} else {
    dir = ".\\dist";
}

if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir);
} else if (!fs.existsSync(dir)) {
    console.log(chalk.blue(`New directory created: ${dir}`));
    fs.mkdirSync(dir);
}

// Read file and generate HTML
fs.readFile(options.input, (err, data) => {
    if (err) {
        if (err.code == "EISDIR") {
            var filenames = fs.readdirSync(options.input);
            filenames.forEach(function (filename) {
                var content = fs.readFileSync(options.input + "\\" + filename, "utf-8");
                if (path.extname(filename) == ".txt") {
                    HTMLcreate(options.input + "\\" + filename, content.toString());
                }
            });
            indexCreate(dir);
        }
        return;
    } else if (path.extname(options.input) != ".txt") {
        console.log(chalk.red.bold("Please select a text file."));
        return;
    }
    HTMLcreate(options.input, data.toString());
    indexCreate(dir);
});

// HTML file creation
function HTMLcreate(filename, content) {
    var title = content.split("\r\n")[0];
    var body = content.split("\n\r");
    var newBody = "<h1>" + title + "</h1>";

    body.forEach(function (line, index) {
        if (index != 0) {
            newBody += "<p>" + line + "</p>";
        }
    });

    var html = createHTML({
        title: title,
        body: newBody,
    });

    fs.writeFileSync(`${dir + "\\" + title}.html`, html);
    console.log(
        chalk.green.bold(
            "HTML file created --> Path: " + `${dir + "\\" + title}.html`
        )
    );
}

// Create index HTML file
function indexCreate(dir) {
    var filenames = fs.readdirSync(dir);
    var body = "<ul>\n";
    filenames.forEach(function (filename) {
        body += `<li><a href=".\\${filename}">${filename.split(".")[0]}</a></li>`;
    });
    body += "</ul>";
    var html = createHTML({
        title: "index",
        body: body,
    });

    fs.writeFileSync(`${dir}\\index.html`, html);
    console.log(
        chalk.green.bold("HTML file created --> Path: " + `${dir}\\index.html`)
    );
}
