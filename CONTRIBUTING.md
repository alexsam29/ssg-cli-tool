# Development Setup

To contribute to this project, setup your development environment according to these steps and use the code formatter and linter described below.

## Fork Repository and Install Packages

1. Download and install a recent version of [Node.js](https://nodejs.org/en/) (8.0 or higher).
2. Fork the project repository and clone the forked repository on to your local machine.
3. Open the repository in your editor/IDE of choice.
4. Open a terminal or command window and move to the directory where the repository was cloned to.
5. Run the command `npm install` followed by `npm install -g` to install packages and install the tool globally.

## Source Code Formatter

This project uses [Prettier](https://prettier.io/) to format the source code.

### Using the Command Line

Once all packages are installed you can format all files using the terminal/CLI with the command:

```
npx prettier --write .
```

You can use `prettier --write .` to format everything, but it's not recommended. It's recommended only to format the source code that you have written/changed.

To format a certain directory use:

```
npx prettier --write directory_name/
```

To format a certain file use:

```
npx prettier --write filepath/filename.js
```

To check whether files have been formatted using Prettier but without overwriting anything, run the command:

```
npx prettier --check .
```

### Editor/IDE Integration

Formatting from the command line is a good way to format the source code and should be done at the minimum. But it can be annoying to run the command(s) every time. Depending on your editor/IDE, you can integrate Prettier so that code formats automatically as it's being written.

[Click here](https://prettier.io/docs/en/editors.html) to find out how to integrate Prettier in your editor/IDE.

## Linter

This project uses [ESLint](https://eslint.org/) as the linter of choice to help make the source code more consistent and to avoid potential bugs.

### Using the Command Line

Once all packages are installed you can use ESLint to check files for coding errors/mistakes with this command:

```
npx eslint yourfile.js
```

You can also do this for multiple files at once, just keep adding filenames to the end like so:

```
npx eslint yourfile.js yourfile_2.js yourfile_3.js
```

It's recommended to do this on all files that have been added or changed.

### Editor/IDE Integration

Much like code formatting, using the command line to check for coding errors should be done at the minimum. However, you can integrate ESLint into your editor/IDE of choice to make the process much easier.

[Click here](https://eslint.org/docs/latest/user-guide/integrations) to find out how to integrate ESLint in your editor/IDE.

## Testing

This project uses [Jest](https://jestjs.io/) for testing. The main purpose for testing is to test the output of the SSG and to test functions used to assist in HTML file creation.

To add a test, go to `tests/test.js` and a test with a short description of what it tests.

To run the tests, use the command:

```
npm test
```

In addition, to run a code coverage analysis, run the command:

```
npm test -- --coverage --collectCoverageFrom="./src/**"
```

Code coverage analysis allows you to see how much of the source code the tests cover. As of right now there's no required minimum. Run the command if you're interested in taking a look at the analysis.
