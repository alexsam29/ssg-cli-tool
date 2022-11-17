const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const createHTML = require("create-html");
const fileCreatedPath = "HTML file created --> Path: ";
const MdParser = require("markdown-it");

// HTML file creation
function HTMLfile(filename, content, dir, lang, isMd) {
  const title = path.basename(filename).split(".")[0];
  let body = "<h1>" + title + "</h1>";

  // if markdown, parse markdown into HTML
  if (isMd === true) {
    const md = new MdParser()
      .use(require("markdown-it-sub"))
      .use(require("markdown-it-sup"))
      .use(require("markdown-it-footnote"))
      .use(require("markdown-it-deflist"))
      .use(require("markdown-it-abbr"))
      .use(require("markdown-it-emoji"))
      .use(require("markdown-it-ins"))
      .use(require("markdown-it-mark"));
    body += "\n" + md.render(content);
  } else {
    const splitContent = content.split(/\r?\n\r?\n/);

    // Append rest of the body after the title
    splitContent.forEach(function (line, index) {
      if (index !== 0) {
        body += "\n<p>" + line + "</p>";
      }
    });
  }

  const html = createHTML({
    title,
    body,
    lang,
  });

  // Write to HTML file
  fs.writeFileSync(`${path.join(dir, path.basename(title))}.html`, html);
  console.log(
    chalk.green.bold(
      fileCreatedPath + `${path.join(path.basename(dir), title)}.html`
    )
  );

  return html;
}

// Create index HTML file
function indexPage(dir, lang) {
  const filenames = fs.readdirSync(dir);
  let body = "<ul>\n";

  // Add links to HTML body
  filenames.forEach(function (filename) {
    body += `\n<li><a href="${path.join(
      path.basename(dir),
      filename.split(".")[0]
    )}.html">${path.basename(filename).split(".")[0]}</a></li>\n`;
  });
  body += "</ul>";

  const html = createHTML({
    title: "index",
    body,
    lang,
  });

  // Write to HTML file
  fs.writeFileSync(`index.html`, html);
  console.log(
    chalk.green.bold(
      fileCreatedPath + `${path.join(path.basename(dir), "index.html")}`
    )
  );

  return html;
}

module.exports = {
  HTMLfile,
  indexPage,
};
