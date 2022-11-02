const path = require("path");
const chalk = require("chalk");
const fs = require("fs");
const create = require("./create.js");
const utils = require("./utils.js");

module.exports.ssgStart = function ssgStart(options) {
  let dir;
  let inputPath = options.input;
  let outputPath = options.output;
  const configPath = options.config;
  let lang = options.lang;

  const defaultLang = "en-CA";
  let inputPathSelectedText = `\nPath of file or folder selected: ${inputPath}`;

  if (!(inputPath || configPath)) {
    console.log(chalk.red.bold("\nPlease enter a valid input/config file.\n"));
    return;
  }

  // if config file is provided and valid, overwrite all option inputs
  if (configPath && fs.existsSync(configPath)) {
    if (utils.configExist(configPath)) {
      const configOptions = parseConfig(configPath);
      inputPath = configOptions.input;
      inputPathSelectedText = `\nPath of file or folder selected: ${inputPath}`;
      outputPath = configOptions.output;
      lang = configOptions.lang;
      if (!lang) {
        lang = defaultLang;
      }
    } else {
      console.log(chalk.red.bold("\nPlease enter a valid JSON config file.\n"));
      return;
    }
  } else if (!inputPath) {
    console.log(chalk.red.bold("\nJSON config file does not exist.\n"));
    return;
  }

  // Create directory.  If no input argument, then output error msg and exit
  if (outputPath) {
    // Output file/directory path
    console.log(chalk.bgWhite(inputPathSelectedText));
    dir = outputPath;
  } else if (inputPath) {
    // Output file/directory path
    console.log(chalk.bgWhite(inputPathSelectedText));
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
  if (utils.isDirectory(inputPath)) {
    const filenames = fs.readdirSync(inputPath);
    filenames.forEach(function (filename) {
      const filePath = path.join(inputPath, filename);
      if (fs.lstatSync(filePath).isFile()) {
        readFromFile(filePath, dir, configPath, utils.getLang(lang));
      }
    });
    create.indexPage(dir, utils.getLang(lang));
  } else if (utils.isFile(inputPath)) {
    readFromFile(inputPath, dir, configPath, utils.getLang(lang));
    create.indexPage(dir, utils.getLang(lang));
  } else {
    console.log(
      chalk.red.bold("\nPlease enter a valid file/directory path.\n")
    );
  }
};

// Read from input file
function readFromFile(inputPath, dir, configPath, lang) {
  const data = fs.readFileSync(inputPath, "utf-8");
  if (path.extname(inputPath) === ".txt" || path.extname(inputPath) === ".md") {
    // Create HTML for single txt file
    if (utils.configExist(configPath) || utils.isMd(inputPath)) {
      create.HTMLfile(
        inputPath.split("/").slice(-1)[0].split(".")[0],
        data,
        dir,
        utils.getLang(lang),
        utils.isMd(inputPath)
      );
    } else if (utils.isDirectory(inputPath)) {
      create.HTMLfile(
        inputPath.split(".")[0],
        data,
        dir,
        utils.getLang(lang),
        utils.isMd(inputPath)
      );
    } else {
      create.HTMLfile(
        inputPath.split("\\").slice(-1)[0].split(".")[0],
        data,
        dir,
        utils.getLang(lang),
        utils.isMd(inputPath)
      );
    }
  }
}

// Parse JSON config file
function parseConfig(configFile) {
  const configs = fs.readFileSync(configFile, "utf-8");
  const JSONconfigs = JSON.parse(configs);
  return JSONconfigs;
}
