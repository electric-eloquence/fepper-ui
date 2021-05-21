/**
 * e2e test server and runner.
 */
const fs = require('fs');
const {spawn} = require('child_process');

const mkdirp = require('mkdirp');

const fepperUiDir = `${__dirname}/../node_modules/fepper-ui`;
const indexJs = 'index.js';
const scriptsDir = 'scripts';
const scriptsPatternDir = 'scripts/pattern';
const stylesDir = 'styles';

if (!fs.existsSync(`${fepperUiDir}/${scriptsDir}`)) {
  mkdirp.sync(`${fepperUiDir}/${scriptsDir}`);
}

if (!fs.existsSync(`${fepperUiDir}/${scriptsDir}/${indexJs}`)) {
  fs.copyFileSync(`${__dirname}/../${scriptsDir}/${indexJs}`, `${fepperUiDir}/${scriptsDir}/${indexJs}`);
}

if (!fs.existsSync(`${fepperUiDir}/${scriptsPatternDir}`)) {
  fs.symlinkSync(`${__dirname}/../${scriptsPatternDir}`, `${fepperUiDir}/${scriptsPatternDir}`);
}

if (!fs.existsSync(`${fepperUiDir}/${stylesDir}`)) {
  fs.symlinkSync(`${__dirname}/../${stylesDir}`, `${fepperUiDir}/${stylesDir}`);
}

require('./serve').then((server) => {
  const args = [`${__dirname}/wdio.conf.js`];
  const wdio = spawn(`${__dirname}/../node_modules/.bin/wdio`, args, {stdio: 'inherit'});

  wdio.on('exit', function (code) {
    server.close();
    process.exit(code); // eslint-disable-line no-process-exit
  });

  wdio.on('error', function (err) {
    server.close();
    throw err;
  });
});
