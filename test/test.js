const { HTMLfile, indexPage } = require("../src/create");
const fs = require("fs");
const path = require("path");
const {
  getLang,
  isDirectory,
  isFile,
  isMd,
  configExist,
  osSpecificPath,
} = require("../src/utils");

/* eslint-disable no-undef */
describe("\nSSG Testing", function () {
  // HTML generation
  test("MD --> HTML file conversion", function () {
    expect(
      HTMLfile(
        "../testFiles/input MD.md",
        fs.readFileSync("testFiles/input MD.md", "utf-8"),
        path.join(__dirname, "../testFiles/testDist"),
        getLang(),
        true
      )
    ).toMatchSnapshot();
  });
  test("TXT --> HTML file conversion", function () {
    expect(
      HTMLfile(
        "../testFiles/Silver Blaze.txt",
        fs.readFileSync("testFiles/Silver Blaze.txt", "utf-8"),
        path.join(__dirname, "../testFiles/testDist"),
        getLang(),
        false
      )
    ).toMatchSnapshot();
  });
  test("Index file creation", function () {
    expect(indexPage("testFiles/testDist")).toMatchSnapshot();
  });

  // Util testing
  test("Test: isDirectory() == true", function () {
    expect(isDirectory("testFiles")).toBeTruthy();
  });
  test("Test: isDirectory() == false", function () {
    expect(isDirectory("testFiles/notadirectory")).toBeFalsy();
  });
  test("Test: isFile() == true", function () {
    expect(isFile("testFiles/Silver Blaze.txt")).toBeTruthy();
  });
  test("Test: isFile() == false", function () {
    expect(isFile("testFiles/notafile.txt")).toBeFalsy();
  });
  test("Test: isMd() == true", function () {
    expect(isMd("testFiles/input MD.md")).toBeTruthy();
  });
  test("Test: isMd() == false", function () {
    expect(isMd("testFiles/notafile.txt")).toBeFalsy();
  });
  test("Test: isMd() throws error and returns false", function () {
    expect(isMd(12546)).toBeFalsy();
  });
  test("Test: configExist() == true", function () {
    expect(configExist("testFiles/ssg-config.json")).toBeTruthy();
  });
  test("Test: configExist() == false", function () {
    expect(configExist("testFiles/notafile.txt")).toBeFalsy();
  });
  test("Test: configExist() throws error and returns false", function () {
    expect(configExist(11234)).toBeFalsy();
  });
  test("Test: getLang() with no arguments", function () {
    expect(getLang()).toBe("en-CA");
  });
  test("Test: getLang() eith 1 argument", function () {
    expect(getLang("fr")).toBe("fr");
  });
  test("Test: osSpecificPath()", function () {
    expect(osSpecificPath("../testFiles/testDist")).toBe(
      "..\\testFiles\\testDist"
    );
  });
  test("Test: osSpecificPath()", function () {
    expect(osSpecificPath()).toBeFalsy();
  });
});
