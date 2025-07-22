const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
  try {
    const image = core.getInput('image');
    const path = core.getInput('path');
    const destination = core.getInput('destination') || `extracted-${Date.now()}`;
    const shell = core.getInput('shell');

    if (!core.getInput('destination')) {
      core.notice([
        'As you did not specify a docker extract destination, the default is being used.',
        'As of shrink/actions-docker-extract@v3.0.1 the default does not include a dot prefix.',
        `v3.0.0: ".${destination}", v3.0.1: "${destination}"`,
        'See https://github.com/shrink/actions-docker-extract/issues/28 for context.',
        'No action is required unless this Workflow depends upon the dot prefix.',
      ].join(' '));
    }

    const create = `docker cp $(docker create ${image}):/${path} ${destination}`;

    await exec.exec(`mkdir -p ${destination}`);
    await exec.exec(`${shell} -c "${create}"`, []);

    core.setOutput('destination', destination);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
