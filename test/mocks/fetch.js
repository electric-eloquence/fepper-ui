const fs = require('fs-extra');

global.fetch = (url, init) => {
  return new Promise(
    (resolve) => {
      if (url.startsWith('/gatekeeper')) {
        switch (global.mockResponse.gatekeeper_status) {
          case 403:
            resolve({
              status: global.mockResponse.gatekeeper_status,
              statusText: 'Forbidden',
              /* eslint-disable max-len */
              text: () => Promise.resolve(`
<section id="forbidden" class="error">
  <p>ERROR! You can only use the Markdown Editor on the machine that is running this Fepper instance!</p>
  <p>If you <em>are</em> on this machine, you may need to resync this browser with Fepper.</p>
  <p>Please go to the command line and quit this Fepper instance. Then run <code>fp</code> (not <code>fp restart</code>).</p>
</section>`)
              /* eslint-enable max-len */
            });

            break;

          default:
            resolve({
              status: 200,
              statusText: 'OK',
              text: () => Promise.resolve('')
            });
        }

        return;
      }

      if (url === '/git-interface') {
        const command = init.body ? init.body.get('args[0]') : 'remote';
        let message = `Command failed: git ${command}`;
        let relPath;
        let resolveObj = {
          status: global.mockResponse[`git_${command}_status`]
        };

        if (init.body && init.body.has('rel_path')) {
          relPath = init.body.get('rel_path') || '.';
        }

        if (relPath) {
          message += ` ${relPath}`;
        }

        switch (resolveObj.status) {
          case 403:
            Object.assign(resolveObj, {
              json: () => Promise.resolve({message, stack: message}),
              statusText: 'Forbidden',
              /* eslint-disable max-len */
              text: () => Promise.resolve(`
<section id="forbidden" class="error">
  <p>ERROR! You can only use the Git Interface on the machine that is running this Fepper instance!</p>
  <p>If you <em>are</em> on this machine, you may need to resync this browser with Fepper.</p>
  <p>Please go to the command line and quit this Fepper instance. Then run <code>fp</code> (not <code>fp restart</code>).</p>
</section>`)
              /* eslint-enable max-len */
            });

            break;

          case 500:
            Object.assign(resolveObj, {
              json: () => Promise.resolve({message, stack: message}),
              statusText: 'Internal Server Error'
            });

            break;

          case 501:
            Object.assign(resolveObj, {
              json: () => Promise.resolve({
                message: `Command failed: git remote --verbose
'git' is not recognized as an internal or external command, operable program or batch file.`
              }),
              statusText: 'Not Implemented'
            });

            break;

          default:
            resolveObj = {
              status: 200,
              statusText: 'OK',
              text: () => Promise.resolve('OK')
            };
        }

        resolve(resolveObj);
        return;
      }

      if (url === '/markdown-editor') {
        switch (global.mockResponse.markdown_save_status) {
          case 304:
            resolve({
              status: global.mockResponse.markdown_save_status,
              statusText: 'Not Modified'
            });

            break;

          case 500:
            resolve({
              status: global.mockResponse.markdown_save_status,
              statusText: 'Internal Server Error'
            });

            break;

          default:
            resolve({
              status: 200,
              statusText: 'OK',
              text: () => Promise.resolve('')
            });
        }

        return;
      }

      if (/\?\d+$/.test(url)) {
        const path = __dirname + '/../..' + url.slice(0, url.indexOf('?'));

        if (fs.existsSync(path)) {
          resolve({
            status: 200,
            text: () => Promise.resolve(fs.readFileSync(path, 'utf8'))
          });
        }
        else {
          resolve({
            status: 404,
            statusText: 'Not Found',
            text: () => Promise.resolve('')
          });
        }

        return;
      }
    });
};
