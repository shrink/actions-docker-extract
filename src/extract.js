const core = require('@actions/core');
const io = require('@actions/io');
const exec = require('@actions/exec');
const stream = require('stream')

async function run() {
  try {
    const image = core.getInput('image')
    const path = core.getInput('path')
    const destination = `.extracted-${Date.now()}`;
    let imageName = ""
    writer = new stream.Writable()
    writer._write = function (chunk, _, next) {
      value = chunk.toString('utf8')
      if(!value.includes("[command]")) {
        imageName = imageName.concat(chunk.toString('utf8')).trimEnd();
      }
      next()
    }
    await io.mkdirP(destination);
    await exec.exec('docker', ['create', image], {outStream: writer});
    await exec.exec('docker', ['cp', imageName.concat(':/',path), destination])
    await exec.exec('docker', ['rm','-v', imageName])

    core.setOutput('destination', destination);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
