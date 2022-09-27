const yargs = require("yargs");
const path = require("path");
const fs = require("fs");
const createHTML = require("create-html");
const chalk = require("chalk");
const { version } = require("../package.json");
const { name } = require("../package.json");
const { author } = require("../package.json");

function processMD(mdText, pattern, openTag, closeTag) {
    let result = "";
    let closed = true;

    const arr = mdText.split(pattern);

    arr.forEach((element, ind) => {
        result += element;
        if (ind < arr.length - 1) {
            result += ind % 2 === 0 ? openTag : closeTag;
            closed = !closed;
        }
    });
    result += !closed ? closeTag : "";

    return result;
}

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
    var isMd = false;

    // Determine if input is a valid file or directory
    try {
        isDirectory = fs.lstatSync(options.input).isDirectory();
        isFile = fs.lstatSync(options.input).isFile();
    } catch (error) {
        console.log(
            chalk.red.bold("\nPlease enter a valid file/directory path.\n")
        );
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
        dir = path.join(__dirname, "../dist");
        console.log(dir);
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
            var filePath = path.join(options.input, filename);
            if (fs.lstatSync(filePath).isFile()) {
                var content = fs.readFileSync(filePath, "utf-8");
                if (
                    path.extname(filename) == ".txt" ||
                    path.extname(filename) == ".md"
                ) {
                    // Check if file extension is txt or md
                    if (path.extname(filename) == ".md") {
                        // Check and flag for .md files
                        isMd = true;
                    } else {
                        isMd = false;
                    }
                    HTMLcreate(filename.split(".")[0], content);
                }
            }
        });
        indexCreate(dir);
    } else if (isFile) {
        // If input file is not a txt file, output error msg
        if (
            path.extname(options.input) != ".txt" &&
            path.extname(options.input) != ".md"
        ) {
            //Check if file extension is .txt or .md
            console.log(chalk.red.bold("Please select a text or markdown file."));
            return;
        }

        if (path.extname(options.input) == ".md") {
            // Check and flag for .md files
            isMd = true;
        }

        // Create HTML for single txt file
        var data = fs.readFileSync(options.input, "utf-8");
        HTMLcreate(options.input.split("\\").slice(-1)[0].split(".")[0], data);
        indexCreate(dir);
    }

    // HTML file creation
    function HTMLcreate(filename, content) {
        var title = filename;
        // if markdown process markdown special characters
        if (isMd == true) {
            content = processMD(content, "__", "<strong>", "</strong>");
            content = processMD(content, "_", "<i>", "</i>");
            content = processMD(content, "**", "<strong>", "</strong>");
            content = processMD(content, "*", "<i>", "</i>");
            content = processMD(content, "`", "<code>", "</code>");
        }
        var body = content.split(/\r?\n\r?\n/);
        var newBody = "<h1>" + title + "</h1>";

        // Append rest of the body after the title
        body.forEach(function (line, index) {
            if (index !== 0) {
                newBody += "\n<p>" + line + "</p>\n";
            }
        });

        var html = createHTML({
            title: title,
            body: newBody,
        });

        // Write to HTML file
        fs.writeFileSync(`${dir + "/" + path.basename(title)}.html`, html);
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
            body += `\n<li><a href="${dir}\\${filename}">${filename.split(".")[0]
                }</a></li>\n`;
        });
        body += "</ul>";

        var html = createHTML({
            title: "index",
            body: body,
        });

        // Write to HTML file
        fs.writeFileSync(`index.html`, html);
        console.log(
            chalk.green.bold("HTML file created --> Path: " + `${dir}\\index.html`)
        );
    }
};
