const fs = require('fs-extra');

global.fetch = (url, init) => {
  return new Promise(
    (resolve) => {
      if (url.startsWith('/gatekeeper')) {
        if (global.mockResponse && global.mockResponse.gatekeeperStatus === 403) {
          resolve({
            status: 403,
            statusText: 'Forbidden',
            /* eslint-disable max-len */
            text: () => `
<section id="forbidden" class="error">
  <p>ERROR! You can only use %s on the machine that is running this Fepper instance!</p>
  <p>If you <em>are</em> on this machine, you may need to resync this browser with Fepper.</p>
  <p>Please go to the command line and quit this Fepper instance. Then run <code>fp</code> (not <code>fp restart</code>).</p>
</section>`
            /* eslint-enable max-len */
          });
        }
        else {
          resolve({status: 200});
        }

        return;
      }

      if (url === '/git-integrator') {
        const args0 = init.body.get('args[0]');

        switch (args0) {
          case 'add': {
            resolve({
              status: 200,
              text: () => {
                return 'OK';
              }
            });

            break;
          }
          case 'commit': {
            if (global.mockResponse && global.mockResponse.gitCommitStatus === 500) {
              resolve({
                json: () => {
                  return {message: 'Command failed:', stack: 'Command failed:'};
                },
                status: 500
              });
            }
            else {
              resolve({
                status: 200,
                text: () => {
                  return 'OK';
                }
              });
            }

            break;
          }
          case 'pull': {
            if (global.mockResponse && global.mockResponse.gitPullStatus === 500) {
              resolve({
                json: () => {
                  return {message: 'Command failed:', stack: 'Command failed:'};
                },
                status: 500
              });
            }
            else {
              resolve({status: 200});
            }

            break;
          }
          case 'push': {
            if (global.mockResponse && global.mockResponse.gitPushStatus === 500) {
              resolve({
                json: () => {
                  return {message: 'Command failed:', stack: 'Command failed:'};
                },
                status: 500
              });
            }
            else {
              resolve({
                status: 200,
                text: () => {
                  return 'OK';
                }
              });
            }

            break;
          }
          case 'remote': {
            if (global.mockResponse && global.mockResponse.gitRemoteStatus === 501) {
              resolve({
                status: 501,
                text: () => 'fatal:'
              });
            }
            else {
              resolve({status: 200});
            }

            break;
          }
          case '--version': {
            if (global.mockResponse && global.mockResponse.gitVersionStatus === 403) {
              resolve({
                status: 403,
                /* eslint-disable max-len */
                text: () => `
<section id="forbidden" class="error">
  <p>ERROR! You can only use %s on the machine that is running this Fepper instance!</p>
  <p>If you <em>are</em> on this machine, you may need to resync this browser with Fepper.</p>
  <p>Please go to the command line and quit this Fepper instance. Then run <code>fp</code> (not <code>fp restart</code>).</p>
</section>`
                /* eslint-enable max-len */
              });
            }
            else if (global.mockResponse && global.mockResponse.gitVersionStatus === 501) {
              resolve({
                status: 501,
                text: () => 'fatal:'
              });
            }
            else {
              resolve({status: 200});
            }

            break;
          }
        }

        return;
      }

      if (url === '/markdown-editor') {
        if (global.mockResponse && global.mockResponse.markdownSaveStatus === 500) {
          resolve({
            status: 500,
            statusText: 'Internal Server Error'
          });
        }
        else {
          resolve({status: 200});
        }

        return;
      }

      if (/\?\d+$/.test(url)) {
        const path = __dirname + '/../..' + url.slice(0, url.indexOf('?'));

        if (fs.existsSync(path)) {
          resolve({
            status: 200,
            text: () => fs.readFileSync(path, 'utf8')
          });
        }
        else {
          resolve({
            status: 404,
            statusText: 'Not Found'
          });
        }

        return;
      }
    });
};
