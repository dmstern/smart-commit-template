# smart-commit-template

This is a small command line tool, which configures a `post-commit` and a `post-checkout` git hook and sets the `commit.template` to `.git/.gitmessage.txt`.

This allows VSCode to automatically remember your last entered commit message and pre-fill the commit message input with the recently checked-out branch name.

## Installation

```bash
npm i -g smart-commit-template
```

## Usage

```bash
cd my-project-folder
smart-commit-template
```
