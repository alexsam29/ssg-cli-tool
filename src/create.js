const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const createHTML = require("create-html");
const fileCreatedPath = "HTML file created --> Path: ";

// HTML file creation
function HTMLfile(filename, content, dir, lang, isMd) {
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
            fileCreatedPath + `${path.basename(dir) + "\\" + title}.html`
        )
    );
}

// Create index HTML file
function indexPage(dir, lang) {
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
        chalk.green.bold(fileCreatedPath + `${path.basename(dir)}\\index.html`)
    );
}

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

module.exports = {
    HTMLfile,
    indexPage,
};
