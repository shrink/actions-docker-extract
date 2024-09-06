const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
  try {
    const image = core.getInput('image');
    const path = core.getInput('path');
    const destination = core.getInput('destination') || `extracted-${Date.now()}`;

    if (!core.getInput('destination')) {
      core.notice([
        'As you did not specify a destination, the default is being used.',
        'As of version shrink/actions-docker-extract@3.0.1, the default does not include a dot prefix.',
        'See https://github.com/shrink/actions-docker-extract/issues/28 for context.',
      ].join(' '));
    }

    const create = `docker cp $(docker create ${image}):/${path} ${destination}`;

    await exec.exec(`mkdir -p ${destination}`);
    await exec.exec(`/bin/bash -c "${create}"`, []);

    core.setOutput('destination', destination);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
