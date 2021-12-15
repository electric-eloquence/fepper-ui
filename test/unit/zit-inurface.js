/**
 * We need to run this after the other unit tests so the dataSaver value doesn't interfere with other tests.
 * Since the easiest way to ensure this is by putting this in last place alphabetically, it is named zit-inurface.js.
 */
import {expect} from 'chai';

import fepperUi from '../unit';

const $orgs = fepperUi.requerio.$orgs;
const {
  codeViewer,
  dataSaver
} = fepperUi;

describe('Git Interface', function () {
  describe('git_interface conf true', function () {
    before(function () {
      fepperUi.uiData.config.gitInterface = true;
    });

    beforeEach(function () {
      $orgs['#sg-code-btn-git-disable'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-pane-git'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-pane-git'].dispatchAction('removeClass', 'git-interface-on');
      $orgs['#sg-code-pane-git-na'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-pane-git-na'].dispatchAction(
        'html', '<pre>Git has not been set up for this project.</pre>');
      $orgs['#sg-code-radio-git-off'].dispatchAction('prop', {checked: true});
      $orgs['#sg-code-tab-git'].dispatchAction('removeClass', 'sg-code-tab-warning');
    });

    after(function () {
      fepperUi.uiData.config.gitInterface = false;
    });

    it('Git not installed', function () {
      global.location = {
        search: '?view=code'
      };
      global.mockResponse = {
        gitVersionStatus: 501
      };

      dataSaver.updateValue('gitInterface', 'true');

      const dataSaverGitInterfaceBefore = dataSaver.findValue('gitInterface');
      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();

      return codeViewer.stoke()
        .then(() => {
          const dataSaverGitInterfaceAfter = dataSaver.findValue('gitInterface');
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();

          expect(dataSaverGitInterfaceBefore).to.equal('true');
          expect(paneGitNaStateBefore.css).to.not.have.key('display');

          expect(dataSaverGitInterfaceAfter).to.equal('false');
          expect(paneGitNaStateAfter.css.display).to.equal('block');
        });
    });

    it('Git installed, no remote', function () {
      global.location = {
        search: '?view=code'
      };
      global.mockResponse = {
        gitVersionStatus: 200,
        gitRemoteStatus: 501
      };

      dataSaver.updateValue('gitInterface', 'true');

      const dataSaverGitInterfaceBefore = dataSaver.findValue('gitInterface');
      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();

      return codeViewer.stoke()
        .then(() => {
          const dataSaverGitInterfaceAfter = dataSaver.findValue('gitInterface');
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();

          expect(dataSaverGitInterfaceBefore).to.not.equal(dataSaverGitInterfaceAfter);
          expect(paneGitNaStateBefore.css.display).to.not.equal(paneGitNaStateAfter.css.display);

          expect(dataSaverGitInterfaceAfter).to.equal('false');
          expect(paneGitNaStateAfter.css.display).to.equal('block');
        });
    });

    it('Git installed, cloned and pulled from a remote, no cookie set', function () {
      global.location = {
        search: '?view=code'
      };
      global.mockResponse = {
        gitVersionStatus: 200,
        gitRemoteStatus: 200,
        gitPullStatus: 200
      };

      dataSaver.removeValue('gitInterface');

      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();
      const radioGitOnStateBefore = $orgs['#sg-code-radio-git-on'].getState();

      return codeViewer.stoke()
        .then(() => {
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const radioGitOnStateAfter = $orgs['#sg-code-radio-git-on'].getState();

          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneGitStateBefore.classArray).to.not.include('git-interface-on');
          expect(radioGitOnStateBefore.prop.checked).to.not.equal(radioGitOnStateAfter.prop.checked);

          expect(paneGitStateAfter.css.display).to.equal('block');
          expect(paneGitStateAfter.classArray).to.include('git-interface-on');
          expect(paneGitNaStateAfter.css).to.not.have.key('display');
          expect(radioGitOnStateAfter.prop.checked).to.be.true;
        });
    });

    it('Git installed, cloned and pulled from a remote, cookie set', function () {
      global.location = {
        search: '?view=code'
      };
      global.mockResponse = {
        gitVersionStatus: 200,
        gitRemoteStatus: 200,
        gitPullStatus: 200
      };

      $orgs['#sg-code-radio-git-on'].dispatchAction('prop', {checked: ''});

      const dataSaverGitInterface = dataSaver.findValue('gitInterface');
      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();
      const radioGitOnStateBefore = $orgs['#sg-code-radio-git-on'].getState();

      return codeViewer.stoke()
        .then(() => {
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const radioGitOnStateAfter = $orgs['#sg-code-radio-git-on'].getState();

          expect(dataSaverGitInterface).to.equal('true');
          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneGitStateBefore.classArray).to.not.include('git-interface-on');
          expect(radioGitOnStateBefore.prop.checked).to.not.equal(radioGitOnStateAfter.prop.checked);

          expect(paneGitStateAfter.css.display).to.equal('block');
          expect(paneGitStateAfter.classArray).to.include('git-interface-on');
          expect(paneGitNaStateAfter.css).to.not.have.key('display');
          expect(radioGitOnStateAfter.prop.checked).to.be.true;
        });
    });

    it('Git installed, cloned from a remote, pull failed, cookie set', function () {
      global.location = {
        search: '?view=code'
      };
      global.mockResponse = {
        gitVersionStatus: 200,
        gitRemoteStatus: 200,
        gitPullStatus: 500
      };

      $orgs['#sg-code-radio-git-on'].dispatchAction('prop', {checked: ''});

      const dataSaverGitInterface = dataSaver.findValue('gitInterface');
      const btnGitDisableStateBefore = $orgs['#sg-code-btn-git-disable'].getState();
      const btnMarkdownEditStateBefore = $orgs['#sg-code-btn-markdown-edit'].getState();
      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();
      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const radioGitOnStateBefore = $orgs['#sg-code-radio-git-on'].getState();
      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();

      return codeViewer.stoke()
        .then(() => {
          const btnGitDisableStateAfter = $orgs['#sg-code-btn-git-disable'].getState();
          const btnMarkdownEditStateAfter = $orgs['#sg-code-btn-markdown-edit'].getState();
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const radioGitOnStateAfter = $orgs['#sg-code-radio-git-on'].getState();
          const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();

          expect(dataSaverGitInterface).to.equal('true');
          expect(btnGitDisableStateBefore.css.display).to.not.equal(btnGitDisableStateAfter.css.display);
          expect(btnMarkdownEditStateBefore.css.display).to.not.equal(btnMarkdownEditStateAfter.css.display);
          expect(paneGitStateBefore.classArray).to.not.include('git-interface-on');
          expect(paneGitNaStateBefore.css.display).to.not.equal(paneGitNaStateAfter.css.display);
          expect(paneGitNaStateBefore.html).to.not.equal(paneGitNaStateAfter.html);
          expect(radioGitOnStateBefore.prop.checked).to.not.equal(radioGitOnStateAfter.prop.checked);
          expect(tabGitStateBefore.classArray).to.not.include('sg-code-tab-warning');

          expect(btnGitDisableStateAfter.css.display).to.equal('block');
          expect(btnMarkdownEditStateAfter.css.display).to.equal('none');
          expect(paneGitNaStateAfter.css.display).to.equal('block');
          expect(paneGitNaStateAfter.html).to.equal(
            '<pre class="sg-code-pane-content-warning"><code>Command failed:</code></pre>');
          expect(paneGitStateAfter.classArray).to.include('git-interface-on');
          expect(radioGitOnStateAfter.prop.checked).to.be.true;
          expect(tabGitStateAfter.classArray).to.include('sg-code-tab-warning');
        });
    });

    it('forbidden by gatekeeper', function () {
      global.location = {
        search: '?view=code'
      };
      global.mockResponse = {
        gitVersionStatus: 403
      };

      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();

      return codeViewer.stoke()
        .then(() => {
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();

          expect(paneGitNaStateBefore.css).to.not.have.key('display');

          expect(paneGitNaStateAfter.css.display).to.equal('block');
          /* eslint-disable max-len */
          expect(paneGitNaStateAfter.html).to.equal(`<section id="forbidden" class="error sg-code-pane-content-warning" xmlns="http://www.w3.org/1999/xhtml">
  <p>ERROR! You can only use %s on the machine that is running this Fepper instance!</p>
  <p>If you <em>are</em> on this machine, you may need to resync this browser with Fepper.</p>
  <p>Please go to the command line and quit this Fepper instance. Then run <code>fp</code> (not <code>fp restart</code>).</p>
</section>`);
          /* eslint-enable max-len */
        });
    });
  });

  describe('.addRevision()', function () {
    it('returns 200', function () {
      return codeViewer.addRevision()
        .then((responseText) => {
          expect(responseText).to.equal('OK');
        });
    });
  });

  describe('.commitRevision()', function () {
    it('returns 200 on commit success', function () {
      global.mockResponse = {
        gitCommitStatus: 200
      };

      return codeViewer.commitRevision('args[0]=commit&args[1]=-a&args[2]=-m&args[3]=\'commit body encoded\'')
        .then((responseText) => {
          expect(responseText).to.equal('OK');
        });
    });

    it('returns 500 on commit fail', function () {
      global.mockResponse = {
        gitCommitStatus: 500
      };

      return codeViewer.commitRevision('args[0]=commit&args[1]=-a&args[2]=-m&args[3]=\'commit body encoded\'')
        .catch((err) => {
          expect(err).to.equal('Command failed:');
        });
    });
  });

  describe('.pushRevision()', function () {
    it('returns 200 on commit success', function () {
      global.mockResponse = {
        gitPushStatus: 200
      };

      return codeViewer.pushRevision()
        .then((responseText) => {
          expect(responseText).to.equal('OK');
        });
    });

    it('returns 500 on commit fail', function () {
      global.mockResponse = {
        gitPushStatus: 500
      };

      return codeViewer.pushRevision()
        .catch((err) => {
          expect(err).to.equal('Command failed:');
        });
    });
  });

  describe('.saveMarkdown()', function () {
    beforeEach(function () {
      $orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-pane-git'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-pane-git-na'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-pane-markdown-edit'].dispatchAction('css', {display: ''});
    });

    it('fails if it does not pass gatekeeper', function () {
      global.mockResponse = {
        gatekeeperStatus: 403
      };

      const btnMarkdownEditStateBefore = $orgs['#sg-code-btn-markdown-edit'].getState();
      const paneMarkdownEditStateBefore = $orgs['#sg-code-pane-markdown-edit'].getState();

      return codeViewer.saveMarkdown()
        .then(() => {
          const btnMarkdownEditStateAfter = $orgs['#sg-code-btn-markdown-edit'].getState();
          const paneMarkdownEditStateAfter = $orgs['#sg-code-pane-markdown-edit'].getState();

          expect(btnMarkdownEditStateBefore.css.display).to.not.equal(btnMarkdownEditStateAfter.css.display);
          expect(paneMarkdownEditStateBefore.css.display).to.not.equal(paneMarkdownEditStateAfter.css.display);

          expect(btnMarkdownEditStateAfter.css.display).to.equal('none');
          expect(paneMarkdownEditStateAfter.css.display).to.equal('none');
        });
    });

    it('saves Markdown but does not prompt to `git commit` if Git is not interfaced', function () {
      const expectedMarkdown =
`---
content_key: content
---
[Component](../../patterns/02-components-region/02-components-region.html)
`;
      global.mockResponse = {
        markdownSaveStatus: 200
      };
      codeViewer.patternPartial = 'pages-homepage';

      $orgs['#sg-code-code-language-markdown'].dispatchAction('html', expectedMarkdown);
      $orgs['#sg-code-textarea-markdown'].dispatchAction('val', '');

      dataSaver.updateValue('gitInterface', 'false');

      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();
      const paneMarkdownCommitStateBefore = $orgs['#sg-code-pane-markdown-commit'].getState();
      const paneMarkdownStateBefore = $orgs['#sg-code-pane-markdown'].getState();
      const textareaMarkdownStateBefore = $orgs['#sg-code-textarea-markdown'].getState();

      return codeViewer.saveMarkdown()
        .then(() => {
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();
          const paneMarkdownCommitStateAfter = $orgs['#sg-code-pane-markdown-commit'].getState();
          const paneMarkdownStateAfter = $orgs['#sg-code-pane-markdown'].getState();
          const textareaMarkdownStateAfter = $orgs['#sg-code-textarea-markdown'].getState();

          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneMarkdownCommitStateBefore.css).to.not.have.key('display');
          expect(paneMarkdownStateBefore.css.display).to.not.equal(paneMarkdownStateAfter.css.display);
          expect(textareaMarkdownStateBefore.val).to.not.equal(textareaMarkdownStateAfter.val);

          expect(paneGitStateAfter.css).to.not.have.key('display');
          expect(paneMarkdownCommitStateAfter.css).to.not.have.key('display');
          expect(paneMarkdownStateAfter.css.display).to.equal('block');
          expect(textareaMarkdownStateAfter.val).to.equal(expectedMarkdown);
        });
    });

    it('does not save Markdown if Markdown has not changed', function () {
      const expectedMarkdown =
`---
content_key: content
---
[Component](../../patterns/02-components-region/02-components-region.html)
`;
      global.mockResponse = {
        markdownSaveStatus: 200
      };
      codeViewer.patternPartial = 'pages-homepage';

      $orgs['#sg-code-code-language-markdown'].dispatchAction('html', expectedMarkdown);
      $orgs['#sg-code-textarea-markdown'].dispatchAction('val', expectedMarkdown);

      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();
      const paneMarkdownCommitStateBefore = $orgs['#sg-code-pane-markdown-commit'].getState();
      const paneMarkdownStateBefore = $orgs['#sg-code-pane-markdown'].getState();
      const textareaMarkdownStateBefore = $orgs['#sg-code-textarea-markdown'].getState();

      return codeViewer.saveMarkdown()
        .then(() => {
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();
          const paneMarkdownCommitStateAfter = $orgs['#sg-code-pane-markdown-commit'].getState();
          const paneMarkdownStateAfter = $orgs['#sg-code-pane-markdown'].getState();
          const textareaMarkdownStateAfter = $orgs['#sg-code-textarea-markdown'].getState();

          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneMarkdownCommitStateBefore.css).to.not.have.key('display');
          expect(paneMarkdownStateBefore.css.display).to.not.equal(paneMarkdownStateAfter.css.display);
          expect(textareaMarkdownStateBefore.val).to.equal(textareaMarkdownStateAfter.val);

          expect(paneGitStateAfter.css).to.not.have.key('display');
          expect(paneMarkdownCommitStateAfter.css).to.not.have.key('display');
          expect(paneMarkdownStateAfter.css.display).to.equal('block');
          expect(textareaMarkdownStateAfter.val).to.equal(expectedMarkdown);
        });
    });

    it('saves Markdown and prompts to `git commit` if Git is interfaced', function () {
      const expectedMarkdown =
`---
content_key: content
---
[Component](../../patterns/02-components-region/02-components-region.html)
`;
      global.mockResponse = {
        markdownSaveStatus: 200
      };
      codeViewer.patternPartial = 'pages-homepage';

      $orgs['#sg-code-code-language-markdown'].dispatchAction('html', expectedMarkdown);
      $orgs['#sg-code-textarea-markdown'].dispatchAction('val', '');

      dataSaver.updateValue('gitInterface', 'true');

      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();
      const paneMarkdownCommitStateBefore = $orgs['#sg-code-pane-markdown-commit'].getState();
      const paneMarkdownStateBefore = $orgs['#sg-code-pane-markdown'].getState();
      const textareaMarkdownStateBefore = $orgs['#sg-code-textarea-markdown'].getState();

      return codeViewer.saveMarkdown()
        .then(() => {
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();
          const paneMarkdownCommitStateAfter = $orgs['#sg-code-pane-markdown-commit'].getState();
          const paneMarkdownStateAfter = $orgs['#sg-code-pane-markdown'].getState();
          const textareaMarkdownStateAfter = $orgs['#sg-code-textarea-markdown'].getState();

          expect(paneGitStateBefore.css.display).to.not.equal(paneGitStateAfter.css.display);
          expect(paneMarkdownCommitStateBefore.css.display).to.not.equal(paneMarkdownCommitStateAfter.css.display);
          expect(paneMarkdownStateBefore.css).to.not.have.key('display');
          expect(textareaMarkdownStateBefore.html).to.not.equal(textareaMarkdownStateAfter.html);

          expect(paneGitStateAfter.css.display).to.equal('block');
          expect(paneMarkdownCommitStateAfter.css.display).to.equal('block');
          expect(paneMarkdownStateAfter.css).to.not.have.key('display');
          expect(textareaMarkdownStateAfter.html).to.equal(expectedMarkdown);
        });
    });
  });
});
