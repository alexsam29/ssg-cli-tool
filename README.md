# ssg-cli-tool

A command-line interface Static Site Generator (SSG) used for generating a complete HTML web site from raw data and files.

## Overview

This tool allows a user to input a text, markdown file path, a directory path or a JSON config file path and an HTML file will be created for the specified file or for every text/markdown file in the specified directory.

## Requirements

A recent version of [Node.js](https://nodejs.org/en/) must be downloaded and installed.

## Instructions

1.  Clone or download the repository on to your local machine. Remember the file location!
2.  Open a terminal or command window and move to the directory where the repository was downloaded to.
3.  Before running the tool, run the command `npm install` followed by `npm install -g` to install npm packages and install the tool globally.
4.  Run the SSG tool by inputting a file or folder path.

```
ssg -i file_path
```

5.  If a file was specified, an HTML file will be created and added into the `dist` directory. If a directory was specified, HTML files will be created for every text/markdown file in the directory and they will be added into the `dist` directory.
6.  [OPTIONAL] Specify a directory to output the HTML files to by adding the path as a second argument. If the directory does not exist, a new one will be created. If it does exist, the current contents will be deleted and only the HTML files will be added.

```
ssg -i file_path -o directoryPath
```

NOTE: This will <b>DELETE the specified directory</b> and create a new one with the same name. <b>DO NOT SPECIFY A DIRECTORY WITH IMPORTANT FILES</b>.

7. [OPTIONAL] Indicate the language to use when generating the lang attribute on the root <html> element in the resulting HTML file(s). Default language is `en-CA`.

```
ssg -i testFiles -o randomFolder -l fr
```

8. [OPTIONAL] Specify a JSON configuration file to use instead of inputting options manually in the command line.

```
ssg --config .\testFiles\ssg-config.json
```

Language codes must be ISO 639-1 standard language codes. Which can be found [here](https://www.andiamo.co.uk/resources/iso-language-codes/).

### List of Options

| Option        | Description                                                                                          | Type      |
| ------------- | ---------------------------------------------------------------------------------------------------- | --------- |
| -h, --help    | Show help                                                                                            | [boolean] |
| -v, --version | Show version number                                                                                  | [boolean] |
| -i, --input   | File or folder to generate HTML files from                                                           | [string]  |
| -o, --output  | Specify a different output directory (any existing contents in the directory will be <b>DELETED</b>) | [string]  |
| -l, --lang    | HTML language code for resulting HTML file(s)                                                        | [string]  |
| -c, --config  | Specify a JSON configuration file to use                                                             | [string]  |

## Examples

### Generate HTML file based off a text or markdown file

```
ssg -i file_path
```

Add `" "` for files with spaces.

```
ssg -i ".\testFiles\Silver Blaze.txt"
```

```
ssg -i ".\testFiles\input MD.md"
```

### Generate HTML files based off of text or markdown files within a directory

```
ssg -i .\testFiles
```

Add `" "` for directories with spaces.

```
ssg -i ".\test Files"
```

### Specify the output directory

Any existing contents in the directory will be <b>DELETED</b>.

#### For a File:

```
ssg -i ".\testFiles\Silver Blaze.txt" -o .\anotherFolder
```

#### For a directory:

```
ssg -i .\testFiles -o .\anotherFolder
```

### Specify a HTML `lang` attribute for resulting HTML files

```
ssg --input testFiles --lang en-GB
```

### Specify a JSON config file

```
ssg --config .\testFiles\configFile.json
```

## Optional Features Implemented

- Title parsed from text and markdown files. It will populate the `<title>` tag and add a `<h1>` tag to the top of the body.
- Allow the user to specify a different output directory using --output or -o. If not specified, dist will be used, but if the user specifies a different output path, it will use that. If the directory does not exist, a new directory will be created.
- If the user specifies a folder for the input, it will automatically generate an index.html file, which has relative links to each of the generated HTML files.
- Italicized text parsed from markdown files. It will add a `<i>` tag to any italicized text.
- Bold text parsed from markdown files. It will add a `<strong>` tag to any bold text.
- Language code added to generated HTML files using input from the `-l`/`--lang` argument.
- Inline code blocks parsed from markdown files. It will add a `<code>` tag to any inline code block.
- Allows the user to use a JSON formatted configuration file to specify all of their SSG options.
