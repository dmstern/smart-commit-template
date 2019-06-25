const util = require("util");
const exec = util.promisify(require("child_process").exec);
const setCommitTemplate = "git config commit.template .git/.gitmessage.txt";
const getCommitTemplate = "git config --get commit.template";

module.exports = {
  configure: async function() {
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

      console.log(setTemplateReturn.stdout);
      console.log("Set .git/.gitmessage.txt as commit template.");
    }
  }
};
