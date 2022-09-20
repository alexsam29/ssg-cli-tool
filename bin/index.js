#!/usr/bin/env node
const yargs = require("yargs");
const path = require("path");
const fs = require("fs");
const createHTML = require("create-html");
const chalk = require("chalk");
const { version } = require("../package.json");
const { name } = require("../package.json");
const { author } = require("../package.json");

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
        demandOption: true,
    })
    .option("o", {
        alias: "output",
        describe: "Specify a different output directory",
        type: "string",
    }).argv;

var dir;
var inputPath = `Path of file or folder: ${options.input}`;
var isDirectory = false;
var isFile = false;

// Determine if input is a valid file or directory
try {
    isDirectory = fs.lstatSync(options.input).isDirectory();
    isFile = fs.lstatSync(options.input).isFile();
} catch (error) {
    console.log(chalk.red.bold("\nPlease enter a valid file/directory path.\n"));
    return;
}

// Create directory.  If no input argument, then output error msg and exit
if (options.output) {
    // Output file/directory path
    console.log(chalk.bgWhite(inputPath));
    dir = options.output;
} else if (options.input) {
    // Output file/directory path
    console.log(chalk.bgWhite(inputPath));
    dir = ".\\dist";
} else {
    console.log(
        chalk.red.bold(
            "\nError. A filename or folder is require for option -i/--input.\n\nEx: ssg -i file_path\n"
        )
    );
    return;
}

// Delete directory if it already exists, then create directory
if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
}
fs.mkdirSync(dir);
console.log(chalk.blue(`New directory created: ${dir}`));

// Read directory or file path and generate HTML
if (isDirectory) {
    var filenames = fs.readdirSync(options.input);
    filenames.forEach(function (filename) {
        var content = fs.readFileSync(options.input + "\\" + filename, "utf-8");
        if (path.extname(filename) == ".txt") {
            HTMLcreate(filename.split(".")[0], content.toString());
        }
    });
    indexCreate(dir);
} else if (isFile) {
    fs.readFile(options.input, (err, data) => {
        if (path.extname(options.input) != ".txt") {
            // If input file is not a txt file, output error msg
            console.log(chalk.red.bold("Please select a text file."));
            return;
        }
        // Create HTML for single txt file
        HTMLcreate(
            options.input.split("\\").slice(-1)[0].split(".")[0],
            data.toString()
        );
        indexCreate(dir);
    });
}

// HTML file creation
function HTMLcreate(filename, content) {
    var title = filename;
    var body = content.split("\n\r");
    var newBody = "<h1>" + title + "</h1>";

    // Append rest of the body after the title
    body.forEach(function (line, index) {
        if (index != 0) {
            newBody += "<p>" + line + "</p>";
        }
    });

    var html = createHTML({
        title: title,
        body: newBody,
    });

    // Write to HTML file
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

    // Add links to HTML body
    filenames.forEach(function (filename) {
        body += `<li><a href="${dir}\\${filename}">${filename.split(".")[0]
            }</a></li>`;
    });
    body += "</ul>";

    var html = createHTML({
        title: "index",
        body: body,
    });

    // Write to HTML file
    fs.writeFileSync(`index.html`, html);
    console.log(
        chalk.green.bold("HTML file created --> Path: " + `.\\index.html`)
    );
}
