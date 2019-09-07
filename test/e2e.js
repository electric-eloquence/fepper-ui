/**
 * e2e test server and runner.
 */
const {spawn} = require('child_process');

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
