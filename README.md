# smart-commit-template

This is a small command line tool, which configures a `post-commit` and a `post-checkout` git hook and sets the `commit.template` to `.git/.gitmessage.txt`.

This allows VSCode to automatically remember your last entered commit message and pre-fill the commit message input with the recently checked-out branch name.

> Note: The latter currently only works if you invoke `git.refresh` with shift+ctrl+p after check-out.

## Installation

```bash
npm i -g @init/smart-commit-template
```

## Usage

```bash
cd my-project-folder
smart-commit-template
```
