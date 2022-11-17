const fs = require("fs");
const path = require("path");

function isDirectory(filePath) {
  try {
    return fs.lstatSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

function isFile(filePath) {
  try {
    return fs.lstatSync(filePath).isFile();
  } catch {
    return false;
  }
}

function isMd(filePath) {
  try {
    return path.extname(filePath) === ".md";
  } catch {
    return false;
  }
}

function configExist(configPath) {
  try {
    return path.extname(configPath) === ".json";
  } catch {
    return false;
  }
}

function getLang(lang) {
  if (lang) {
    return lang;
  } else {
    return "en-CA";
  }
}

function osSpecificPath(oldPath) {
  if (oldPath) {
    let newPath = path.parse(oldPath);
    newPath = path.join(newPath.dir, newPath.base);
    return newPath;
  }
}

module.exports = {
  isDirectory,
  isFile,
  isMd,
  configExist,
  getLang,
  osSpecificPath,
};
