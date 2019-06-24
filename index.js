const fs = require("fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const hooks = {
  "post-checkout": `#!/bin/sh
    # .git/post-checkout
    # Writes the Jira Id + Jira summary to the git commit template from the recently checked out branch name.
    #########################################################################################################

    printf "\`git rev-parse --abbrev-ref HEAD | sed 's/-/❤/' | sed -E 's/[-|_]+/ /g' | sed 's/❤/-/'\`" > .git/.gitmessage.txt`,

  "post-commit": `#!/bin/sh
    # Writes the last commit message into the git commit template.
    ##############################################################

    printf "\`git log -1 --pretty=%s\`" > .git/.gitmessage.txt`
};

const gitHookPath = path.join(__dirname, ".git/hooks/");
const setCommitTemplate = "git config commit.template .git/.gitmessage.txt";
const getCommitTemplate = "git config --get commit.template";

async function setCommitTemplateIfNonePresent() {
  // eslint-disable-next-line no-console
  console.log("Checking git config commit.template...");

  try {
    const getTemplateReturn = await exec(getCommitTemplate);

    if (getTemplateReturn.stdout !== "") {
      // console.debug(
      //   `Git commit template already configured. Not setting a new one.`
      // );
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

  Object.keys(hooks).forEach(async script => {
    const filePath = path.join(__dirname, gitHookPath, script);

    if (fs.existsSync(filePath)) {
      // console.debug(
      //   `A file with the name ${filePath} already exists. Did not write the hook.`
      // );
      return;
    }

    await fs.writeFile(filePath, hooks[script], err => {
      if (err) throw err;
      // eslint-disable-next-line no-console
      console.log(`Saved ${filePath}.`);
    });
  });
}

async function main() {
  await setCommitTemplateIfNonePresent();
  await installGitHooks();
}

main();
