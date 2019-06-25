#!/usr/bin/env node
// =============================================================

const fs = require("fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const readdir = util.promisify(fs.readdir);
const copyFile = util.promisify(fs.copyFile);

const gitHookPath = path.join(__dirname, ".git/hooks/");
const setCommitTemplate = "git config commit.template .git/.gitmessage.txt";
const getCommitTemplate = "git config --get commit.template";

async function setCommitTemplateIfNonePresent() {
  // eslint-disable-next-line no-console
  console.log("Checking git config commit.template...");

  try {
    const getTemplateReturn = await exec(getCommitTemplate);

    // Git commit template already configured. Not setting a new one
    if (getTemplateReturn.stdout !== "") {
      return;
    }
  } catch (e) {
    const setTemplateReturn = await exec(setCommitTemplate);

    if (setTemplateReturn.stderr) {
      throw new Error(setTemplateReturn.stderr);
    }

    // eslint-disable-next-line no-console
    console.log(setTemplateReturn.stdout);
    // eslint-disable-next-line no-console
    console.log("Set .git/.gitmessage.txt as commit template.");
  }
}

async function installGitHooks() {
  // eslint-disable-next-line no-console
  console.log("Checking git hooks...");
  let hooks;
  try {
    hooks = await readdir("./hooks");
  } catch (error) {
    throw error;
  }

  hooks.forEach(async hook => {
    const filePath = path.join(gitHookPath, hook);

    // The hook already exists
    if (fs.existsSync(filePath)) {
      return;
    }

    try {
      await copyFile(path.join("./hooks", hook), filePath);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`${filePath} was not written to .git/hooks.`);
      throw error;
    }

    // eslint-disable-next-line no-console
    console.log(`Saved ${filePath}.`);
  });
}

async function main() {
  await setCommitTemplateIfNonePresent();
  await installGitHooks();
}

main();
