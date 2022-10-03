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

    var dir;
    var inputPath = `\nPath of file or folder selected: ${options.input}`;
    var lang;
    var isDirectory = false;
    var isFile = false;
    var isMd = false;
    var configOptions;
    var inputName = options.input;
    var outputName = options.output;

    if (!(options.input || options.config)) {
        console.log(
            chalk.red.bold("\nPlease enter a valid input/config file.\n")
        );
        return;
    }
    
    // Get HTML language code from -l/--lang argument.  Default to en-CA.
    if (options.lang) {
        lang = options.lang;
    } else {
        lang = "en-CA";
    }

    //if config file is provided and valid, overwrite all option inputs
    if (options.config && fs.existsSync(options.config)) {
        if (path.extname(options.config) == ".json") {
            configOptions = parseConfig(options.config);
            inputName = configOptions.input;
            inputPath = `\nPath of file or folder selected: ${inputName}`;
            outputName = configOptions.output;
            lang = configOptions.lang;
            if (!lang)
            {
                lang = "en-CA";
            }
        }
        else {
            console.log(
                chalk.red.bold("\nPlease enter a valid JSON config file.\n")
            );
        }
    }
    else
    {
        console.log(
            chalk.red.bold("\nJSON config file does not exist.\n")
        );
    }

    // Determine if input is a valid file or directory
    try {
        isDirectory = fs.lstatSync(inputName).isDirectory();
        isFile = fs.lstatSync(inputName).isFile();
    } catch (error) {
        console.log(
            chalk.red.bold("\nPlease enter a valid file/directory path.\n")
        );
        return;
    }

    // Create directory.  If no input argument, then output error msg and exit
    if (outputName) {
        // Output file/directory path
        console.log(chalk.bgWhite(inputPath));
        dir = outputName;
    } else if (inputName) {
        // Output file/directory path
        console.log(chalk.bgWhite(inputPath));
        dir = path.join(__dirname, "../dist");
    } else {
        console.log(
            chalk.red.bold(
                "Error. A filename or folder is require for option -i/--input.\n\nEx: ssg -i file_path\n"
            )
        );
        return;
    }

    // Delete directory if it already exists, then create directory
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
    fs.mkdirSync(dir);
    console.log(chalk.blue(`\nNew directory created: ${dir}\n`));

    // Read directory or file path and generate HTML
    if (isDirectory) {
        var filenames = fs.readdirSync(inputName);
        filenames.forEach(function (filename) {
            var filePath = path.join(inputName, filename);
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
            path.extname(inputName) != ".txt" &&
            path.extname(inputName) != ".md"
        ) {
            //Check if file extension is .txt or .md
            console.log(chalk.red.bold("Please select a text or markdown file."));
            return;
        }

        if (path.extname(inputName) == ".md") {
            // Check and flag for .md files
            isMd = true;
        }

        // Create HTML for single txt file
        var data = fs.readFileSync(inputName, "utf-8");
        if (options.config)
        {
            HTMLcreate(inputName.split("/").slice(-1)[0].split(".")[0], data);
        }
        else
        {
            HTMLcreate(inputName.split("\\").slice(-1)[0].split(".")[0], data);
        }
        
        indexCreate(dir);
    }

    //Parse JSON config file
    function parseConfig(configFile) {
        var configs = fs.readFileSync(configFile, "utf-8");
        var JSONconfigs = JSON.parse(configs);
        return JSONconfigs;
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
            lang: lang,
        });

        // Write to HTML file
        fs.writeFileSync(`${dir + "/" + path.basename(title)}.html`, html);
        console.log(
            chalk.green.bold(
                "HTML file created --> Path: " +
                `${path.basename(dir) + "\\" + title}.html`
            )
        );
    }

    // Create index HTML file
    function indexCreate(dir) {
        var filenames = fs.readdirSync(dir);
        var body = "<ul>\n";

        // Add links to HTML body
        filenames.forEach(function (filename) {
            body += `\n<li><a href=".\\${path.basename(dir)}\\${filename}">${filename.split(".")[0]
                }</a></li>\n`;
        });
        body += "</ul>";

        var html = createHTML({
            title: "index",
            body: body,
            lang: lang,
        });

        // Write to HTML file
        fs.writeFileSync(`index.html`, html);
        console.log(
            chalk.green.bold(
                "HTML file created --> Path: " + `${path.basename(dir)}\\index.html`
            )
        );
    }
};
