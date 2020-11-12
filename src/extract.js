const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
  try {
    const image = core.getInput('image');
    const path = core.getInput('path');
    const destination = `.extracted-${Date.now()}`;
    const create = `docker cp $(docker create ${image}):/${path} ${destination}`;

    await exec.exec(`mkdir -p ${destination}`);
    await exec.exec(`/bin/sh -c "${create}"`, []);
    await exec.exec('pwd');
    await exec.exec(`ls -la ${destination}`);

    core.setOutput('destination', destination);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
