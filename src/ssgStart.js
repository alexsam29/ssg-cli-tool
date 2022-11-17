const path = require("path");
const chalk = require("chalk");
const fs = require("fs");
const create = require("./create.js");
const utils = require("./utils.js");

module.exports.ssgStart = function ssgStart(options) {
  let dir;
  let inputPath = utils.osSpecificPath(options.input);
  let outputPath = utils.osSpecificPath(options.output);
  const configPath = utils.osSpecificPath(options.config);
  let lang = options.lang;

  const defaultLang = "en-CA";
  const inputPathSelectedText = "\nPath of file or folder selected: ";
  let inputPathSelected = `${inputPathSelectedText}${inputPath}`;

  if (!(inputPath || configPath)) {
    console.log(chalk.red.bold("\nPlease enter a valid input/config file.\n"));
    return;
  }

  // if config file is provided and valid, overwrite all option inputs
  if (configPath && fs.existsSync(configPath)) {
    if (utils.configExist(configPath)) {
      const configOptions = parseConfig(utils.osSpecificPath(configPath));
      inputPath = utils.osSpecificPath(configOptions.input);
      inputPathSelected = `${inputPathSelectedText}${inputPath}`;
      outputPath = utils.osSpecificPath(configOptions.output);
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
    dir = outputPath;
  } else if (inputPath) {
    dir = path.join(__dirname, "dist");
  } else {
    console.log(
      chalk.red.bold(
        "Error. A filename or folder is require for option -i/--input.\n\nEx: ssg -i file_path\n"
      )
    );
    return;
  }

  // Output file/directory path
  console.log(chalk.bgWhite(inputPathSelected));

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
        readFromFile(filePath, dir, utils.getLang(lang));
      }
    });
    create.indexPage(dir, utils.getLang(lang));
  } else if (utils.isFile(inputPath)) {
    readFromFile(inputPath, dir, utils.getLang(lang));
    create.indexPage(dir, utils.getLang(lang));
  } else {
    console.log(
      chalk.red.bold("\nPlease enter a valid file/directory path.\n")
    );
  }
};

// Read from input file
function readFromFile(inputPath, dir, lang) {
  const data = fs.readFileSync(inputPath, "utf-8");
  if (path.extname(inputPath) === ".txt" || path.extname(inputPath) === ".md") {
    // Create HTML for single txt file
    create.HTMLfile(
      inputPath,
      data,
      dir,
      utils.getLang(lang),
      utils.isMd(inputPath)
    );
  }
}

// Parse JSON config file
function parseConfig(configFile) {
  const configs = fs.readFileSync(configFile, "utf-8");
  const JSONconfigs = JSON.parse(configs);
  return JSONconfigs;
}
