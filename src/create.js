const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const createHTML = require("create-html");
const fileCreatedPath = "HTML file created --> Path: ";
const mdParser = require("markdown-it");

// HTML file creation
function HTMLfile(filename, content, dir, lang, isMd) {
    var title = filename;
    var body = "<h1>" + title + "</h1>";

    // if markdown, parse markdown into HTML
    if (isMd == true) {
        var md = new mdParser()
            .use(require("markdown-it-sub"))
            .use(require("markdown-it-sup"))
            .use(require("markdown-it-footnote"))
            .use(require("markdown-it-deflist"))
            .use(require('markdown-it-abbr'))
            .use(require('markdown-it-emoji'))
            .use(require('markdown-it-ins'))
            .use(require('markdown-it-mark'));
        body += "\n" + md.render(content);
    } else {
        var splitContent = content.split(/\r?\n\r?\n/);

        // Append rest of the body after the title
        splitContent.forEach(function (line, index) {
            if (index !== 0) {
                body += "\n<p>" + line + "</p>";
            }
        });
    }

    var html = createHTML({
        title: title,
        body: body,
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

module.exports = {
    HTMLfile,
    indexPage,
};
