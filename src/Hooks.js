const path = require("path");
const util = require("util");
const fs = require("fs");
const readdir = util.promisify(fs.readdir);
const copyFile = util.promisify(fs.copyFile);

const gitHookPath = path.resolve("./.git/hooks/");
const hookTemplatePath = path.resolve(__dirname, "..", "hooks");

const install = async function() {
  console.log("Checking git hooks...");
  let hooks;
  try {
    hooks = await readdir(hookTemplatePath);
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
      await copyFile(path.join(hookTemplatePath, hook), filePath);
    } catch (error) {
      console.error(`${filePath} was not written to .git/hooks.`);
      throw error;
    }

    console.log(`Saved ${filePath}.`);
  });
};

module.exports = { install };
