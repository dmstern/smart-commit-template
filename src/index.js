#!/usr/bin/env node
// =============================================================

const CommitTemplate = require("./CommitTemplate");
const Hooks = require("./Hooks");

async function main() {
  await CommitTemplate.configure();
  await Hooks.install();
}

main();
