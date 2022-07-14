/**
 * We need to run this after the other unit tests so the dataSaver value doesn't interfere with other tests.
 * Since the easiest way to ensure this is by putting this in last place alphabetically, it is named zit-inyerface.js.
 */
import {expect} from 'chai';

import * as uiData from '../fixtures/ui-data';

describe('Git Interface', function () {
  let fepperUi;
  let codeViewer;
  let dataSaver;
  let $orgs;

  function updateGitInterfaceBoolean(instanceBool, cookieBool) {
    uiData.config.gitInterface = instanceBool;

    if (typeof cookieBool === 'undefined') {
      dataSaver.removeValue('gitInterface');
    }
    else {
      dataSaver.updateValue('gitInterface', cookieBool);
    }
  }

  before(function () {
    const $organisms = require('../../scripts/requerio/organisms').default;

    fepperUi = require('../unit')($organisms);
    codeViewer = fepperUi.codeViewer;
    dataSaver = fepperUi.dataSaver;
    $orgs = fepperUi.requerio.$orgs;
  });

  after(function () {
    require('../require-cache-bust')();
  });

  describe('from Markdown tab', function () {
    before(function () {
      global.location.search = '?view=code';
      codeViewer.tabActive = 'markdown';
    });

    beforeEach(function () {
      global.mockResponse = {};
      codeViewer.stoked = false;

      $orgs['.sg-code-tab'].dispatchAction('removeClass', 'sg-code-tab-active');
      $orgs['.sg-code-panel'].dispatchAction('removeClass', 'sg-code-panel-active');
      dataSaver.removeValue('tabActive');
      $orgs['#sg-code-panel-markdown'].dispatchAction('removeData', 'markdownSource');
      $orgs['#sg-code-pane-markdown-na'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-code-language-markdown'].dispatchAction('html', '');
      $orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-pane-git-na'].dispatchAction('css', {display: 'none'});
      $orgs['#sg-code-pane-git'].dispatchAction('css', {display: ''});
    });

    it('instance config off, cookie config undefined', function () {
      updateGitInterfaceBoolean(false);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabMarkdownStateBefore = $orgs['#sg-code-tab-markdown'].getState();
      const panelMarkdownStateBefore = $orgs['#sg-code-panel-markdown'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const codePaneMarkdownNaStateBefore = $orgs['#sg-code-pane-markdown-na'].getState();
      const codeLanguageMarkdownStateBefore = $orgs['#sg-code-code-language-markdown'].getState();
      const btnMarkdownEditStateBefore = $orgs['#sg-code-btn-markdown-edit'].getState();
      const codePaneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const codePaneGitStateBefore = $orgs['#sg-code-pane-git'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabMarkdownStateAfter = $orgs['#sg-code-tab-markdown'].getState();
          const panelMarkdownStateAfter = $orgs['#sg-code-panel-markdown'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const codePaneMarkdownNaStateAfter = $orgs['#sg-code-pane-markdown-na'].getState();
          const codeLanguageMarkdownStateAfter = $orgs['#sg-code-code-language-markdown'].getState();
          const btnMarkdownEditStateAfter = $orgs['#sg-code-btn-markdown-edit'].getState();
          const codePaneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const codePaneGitStateAfter = $orgs['#sg-code-pane-git'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabMarkdownStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelMarkdownStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(panelMarkdownStateBefore.data).to.not.have.key('markdownSource');
          expect(tabActiveBefore).to.be.null;
          expect(codePaneMarkdownNaStateBefore.css.display).to.equal('block');
          expect(codeLanguageMarkdownStateBefore.html).to.be.empty;
          expect(btnMarkdownEditStateBefore.css).to.not.have.key('display');
          expect(codePaneGitNaStateBefore.css.display).to.equal('none');
          expect(codePaneGitStateBefore.css).to.not.have.key('display');

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabMarkdownStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelMarkdownStateAfter.classArray).to.include('sg-code-panel-active');
          expect(panelMarkdownStateAfter.data.markdownSource).to.equal('04-pages/00-homepage.md');
          expect(tabActiveAfter).to.equal('markdown');
          expect(codePaneMarkdownNaStateAfter.css).to.not.have.key('display');
          expect(codeLanguageMarkdownStateAfter.html).to.equal(`---
content_key: nav_content
---
*Component*

~*~ # Front Matter separator.

---
content_key: toggler_content
---
<button id="toggler">Toggler</button>
`);
          expect(btnMarkdownEditStateAfter.css).to.not.have.key('display');
          expect(codePaneGitNaStateAfter.css.display).to.equal('none');
          expect(codePaneGitStateAfter.css).to.not.have.key('display');
        });
    });

    it('instance config off, cookie config off', function () {
      updateGitInterfaceBoolean(false, false);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabMarkdownStateBefore = $orgs['#sg-code-tab-markdown'].getState();
      const panelMarkdownStateBefore = $orgs['#sg-code-panel-markdown'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const codePaneMarkdownNaStateBefore = $orgs['#sg-code-pane-markdown-na'].getState();
      const codeLanguageMarkdownStateBefore = $orgs['#sg-code-code-language-markdown'].getState();
      const btnMarkdownEditStateBefore = $orgs['#sg-code-btn-markdown-edit'].getState();
      const codePaneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const codePaneGitStateBefore = $orgs['#sg-code-pane-git'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabMarkdownStateAfter = $orgs['#sg-code-tab-markdown'].getState();
          const panelMarkdownStateAfter = $orgs['#sg-code-panel-markdown'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const codePaneMarkdownNaStateAfter = $orgs['#sg-code-pane-markdown-na'].getState();
          const codeLanguageMarkdownStateAfter = $orgs['#sg-code-code-language-markdown'].getState();
          const btnMarkdownEditStateAfter = $orgs['#sg-code-btn-markdown-edit'].getState();
          const codePaneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const codePaneGitStateAfter = $orgs['#sg-code-pane-git'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabMarkdownStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelMarkdownStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(panelMarkdownStateBefore.data).to.not.have.key('markdownSource');
          expect(tabActiveBefore).to.be.null;
          expect(codePaneMarkdownNaStateBefore.css.display).to.equal('block');
          expect(codeLanguageMarkdownStateBefore.html).to.be.empty;
          expect(btnMarkdownEditStateBefore.css).to.not.have.key('display');
          expect(codePaneGitNaStateBefore.css.display).to.equal('none');
          expect(codePaneGitStateBefore.css).to.not.have.key('display');

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabMarkdownStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelMarkdownStateAfter.classArray).to.include('sg-code-panel-active');
          expect(panelMarkdownStateAfter.data.markdownSource).to.equal('04-pages/00-homepage.md');
          expect(tabActiveAfter).to.equal('markdown');
          expect(codePaneMarkdownNaStateAfter.css).to.not.have.key('display');
          expect(codeLanguageMarkdownStateAfter.html).to.equal(`---
content_key: nav_content
---
*Component*

~*~ # Front Matter separator.

---
content_key: toggler_content
---
<button id="toggler">Toggler</button>
`);
          expect(btnMarkdownEditStateAfter.css).to.not.have.key('display');
          expect(codePaneGitNaStateAfter.css.display).to.equal('none');
          expect(codePaneGitStateAfter.css).to.not.have.key('display');
        });
    });

    it('instance config off, cookie config on, and git pull fails', function () {
      global.mockResponse.git_pull_status = 500;

      updateGitInterfaceBoolean(false, true);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabMarkdownStateBefore = $orgs['#sg-code-tab-markdown'].getState();
      const panelMarkdownStateBefore = $orgs['#sg-code-panel-markdown'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const codePaneMarkdownNaStateBefore = $orgs['#sg-code-pane-markdown-na'].getState();
      const codeLanguageMarkdownStateBefore = $orgs['#sg-code-code-language-markdown'].getState();
      const btnMarkdownEditStateBefore = $orgs['#sg-code-btn-markdown-edit'].getState();
      const codePaneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const codePaneGitStateBefore = $orgs['#sg-code-pane-git'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabMarkdownStateAfter = $orgs['#sg-code-tab-markdown'].getState();
          const panelMarkdownStateAfter = $orgs['#sg-code-panel-markdown'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const codePaneMarkdownNaStateAfter = $orgs['#sg-code-pane-markdown-na'].getState();
          const codeLanguageMarkdownStateAfter = $orgs['#sg-code-code-language-markdown'].getState();
          const btnMarkdownEditStateAfter = $orgs['#sg-code-btn-markdown-edit'].getState();
          const codePaneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const codePaneGitStateAfter = $orgs['#sg-code-pane-git'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabMarkdownStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelMarkdownStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(panelMarkdownStateBefore.data).to.not.have.key('markdownSource');
          expect(tabActiveBefore).to.be.null;
          expect(codePaneMarkdownNaStateBefore.css.display).to.equal('block');
          expect(codeLanguageMarkdownStateBefore.html).to.be.empty;
          expect(btnMarkdownEditStateBefore.css).to.not.have.key('display');
          expect(codePaneGitNaStateBefore.css.display).to.equal('none');
          expect(codePaneGitStateBefore.css).to.not.have.key('display');

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabMarkdownStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelMarkdownStateAfter.classArray).to.include('sg-code-panel-active');
          expect(panelMarkdownStateAfter.data.markdownSource).to.equal('04-pages/00-homepage.md');
          expect(tabActiveAfter).to.equal('markdown');
          expect(codePaneMarkdownNaStateAfter.css).to.not.have.key('display');
          expect(codeLanguageMarkdownStateAfter.html).to.equal(`---
content_key: nav_content
---
*Component*

~*~ # Front Matter separator.

---
content_key: toggler_content
---
<button id="toggler">Toggler</button>
`);
          expect(btnMarkdownEditStateAfter.css.display).to.equal('none');
          expect(codePaneGitNaStateAfter.css.display).to.equal('block');
          expect(codePaneGitStateAfter.css.display).to.equal('none');
        });
    });

    it('instance config off, cookie config on, and git pull succeeds', function () {
      global.mockResponse.git_pull_status = 200;

      updateGitInterfaceBoolean(true, true);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabMarkdownStateBefore = $orgs['#sg-code-tab-markdown'].getState();
      const panelMarkdownStateBefore = $orgs['#sg-code-panel-markdown'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const codePaneMarkdownNaStateBefore = $orgs['#sg-code-pane-markdown-na'].getState();
      const codeLanguageMarkdownStateBefore = $orgs['#sg-code-code-language-markdown'].getState();
      const btnMarkdownEditStateBefore = $orgs['#sg-code-btn-markdown-edit'].getState();
      const codePaneGitStateBefore = $orgs['#sg-code-pane-git'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabMarkdownStateAfter = $orgs['#sg-code-tab-markdown'].getState();
          const panelMarkdownStateAfter = $orgs['#sg-code-panel-markdown'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const codePaneMarkdownNaStateAfter = $orgs['#sg-code-pane-markdown-na'].getState();
          const codeLanguageMarkdownStateAfter = $orgs['#sg-code-code-language-markdown'].getState();
          const btnMarkdownEditStateAfter = $orgs['#sg-code-btn-markdown-edit'].getState();
          const codePaneGitStateAfter = $orgs['#sg-code-pane-git'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabMarkdownStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelMarkdownStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(panelMarkdownStateBefore.data).to.not.have.key('markdownSource');
          expect(tabActiveBefore).to.be.null;
          expect(codePaneMarkdownNaStateBefore.css.display).to.equal('block');
          expect(codeLanguageMarkdownStateBefore.html).to.be.empty;
          expect(btnMarkdownEditStateBefore.css).to.not.have.key('display');
          expect(codePaneGitStateBefore.css).to.not.have.key('display');

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabMarkdownStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelMarkdownStateAfter.classArray).to.include('sg-code-panel-active');
          expect(panelMarkdownStateAfter.data.markdownSource).to.equal('04-pages/00-homepage.md');
          expect(tabActiveAfter).to.equal('markdown');
          expect(codePaneMarkdownNaStateAfter.css).to.not.have.key('display');
          expect(codeLanguageMarkdownStateAfter.html).to.equal(`---
content_key: nav_content
---
*Component*

~*~ # Front Matter separator.

---
content_key: toggler_content
---
<button id="toggler">Toggler</button>
`);
          expect(btnMarkdownEditStateAfter.css).to.not.have.key('display');
          expect(codePaneGitStateAfter.css.display).to.equal('block');
        });
    });

    it('instance config on, cookie config undefined, and git pull fails', function () {
      global.mockResponse.git_pull_status = 500;

      updateGitInterfaceBoolean(true);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabMarkdownStateBefore = $orgs['#sg-code-tab-markdown'].getState();
      const panelMarkdownStateBefore = $orgs['#sg-code-panel-markdown'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const codePaneMarkdownNaStateBefore = $orgs['#sg-code-pane-markdown-na'].getState();
      const codeLanguageMarkdownStateBefore = $orgs['#sg-code-code-language-markdown'].getState();
      const btnMarkdownEditStateBefore = $orgs['#sg-code-btn-markdown-edit'].getState();
      const codePaneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const codePaneGitStateBefore = $orgs['#sg-code-pane-git'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabMarkdownStateAfter = $orgs['#sg-code-tab-markdown'].getState();
          const panelMarkdownStateAfter = $orgs['#sg-code-panel-markdown'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const codePaneMarkdownNaStateAfter = $orgs['#sg-code-pane-markdown-na'].getState();
          const codeLanguageMarkdownStateAfter = $orgs['#sg-code-code-language-markdown'].getState();
          const btnMarkdownEditStateAfter = $orgs['#sg-code-btn-markdown-edit'].getState();
          const codePaneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const codePaneGitStateAfter = $orgs['#sg-code-pane-git'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabMarkdownStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelMarkdownStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(panelMarkdownStateBefore.data).to.not.have.key('markdownSource');
          expect(tabActiveBefore).to.be.null;
          expect(codePaneMarkdownNaStateBefore.css.display).to.equal('block');
          expect(codeLanguageMarkdownStateBefore.html).to.be.empty;
          expect(btnMarkdownEditStateBefore.css.display).to.not.equal(btnMarkdownEditStateAfter.css.display);
          expect(codePaneGitNaStateBefore.css.display).to.not.equal(codePaneGitNaStateAfter.css.display);
          expect(codePaneGitStateBefore.css).to.not.have.key('display');

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabMarkdownStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelMarkdownStateAfter.classArray).to.include('sg-code-panel-active');
          expect(panelMarkdownStateAfter.data.markdownSource).to.equal('04-pages/00-homepage.md');
          expect(tabActiveAfter).to.equal('markdown');
          expect(codePaneMarkdownNaStateAfter.css).to.not.have.key('display');
          expect(codeLanguageMarkdownStateAfter.html).to.equal(`---
content_key: nav_content
---
*Component*

~*~ # Front Matter separator.

---
content_key: toggler_content
---
<button id="toggler">Toggler</button>
`);
          expect(btnMarkdownEditStateAfter.css.display).to.equal('none');
          expect(codePaneGitNaStateAfter.css.display).to.equal('block');
          expect(codePaneGitStateAfter.css.display).to.equal('none');
        });
    });

    it('instance config on, cookie config undefined, and git pull succeeds', function () {
      global.mockResponse.git_pull_status = 200;

      updateGitInterfaceBoolean(true);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabMarkdownStateBefore = $orgs['#sg-code-tab-markdown'].getState();
      const panelMarkdownStateBefore = $orgs['#sg-code-panel-markdown'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const codePaneMarkdownNaStateBefore = $orgs['#sg-code-pane-markdown-na'].getState();
      const codeLanguageMarkdownStateBefore = $orgs['#sg-code-code-language-markdown'].getState();
      const btnMarkdownEditStateBefore = $orgs['#sg-code-btn-markdown-edit'].getState();
      const codePaneGitStateBefore = $orgs['#sg-code-pane-git'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabMarkdownStateAfter = $orgs['#sg-code-tab-markdown'].getState();
          const panelMarkdownStateAfter = $orgs['#sg-code-panel-markdown'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const codePaneMarkdownNaStateAfter = $orgs['#sg-code-pane-markdown-na'].getState();
          const codeLanguageMarkdownStateAfter = $orgs['#sg-code-code-language-markdown'].getState();
          const btnMarkdownEditStateAfter = $orgs['#sg-code-btn-markdown-edit'].getState();
          const codePaneGitStateAfter = $orgs['#sg-code-pane-git'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabMarkdownStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelMarkdownStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(panelMarkdownStateBefore.data).to.not.have.key('markdownSource');
          expect(tabActiveBefore).to.be.null;
          expect(codePaneMarkdownNaStateBefore.css.display).to.equal('block');
          expect(codeLanguageMarkdownStateBefore.html).to.be.empty;
          expect(btnMarkdownEditStateBefore.css).to.not.have.key('display');
          expect(codePaneGitStateBefore.css).to.not.have.key('display');

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabMarkdownStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelMarkdownStateAfter.classArray).to.include('sg-code-panel-active');
          expect(panelMarkdownStateAfter.data.markdownSource).to.equal('04-pages/00-homepage.md');
          expect(tabActiveAfter).to.equal('markdown');
          expect(codePaneMarkdownNaStateAfter.css).to.not.have.key('display');
          expect(codeLanguageMarkdownStateAfter.html).to.equal(`---
content_key: nav_content
---
*Component*

~*~ # Front Matter separator.

---
content_key: toggler_content
---
<button id="toggler">Toggler</button>
`);
          expect(btnMarkdownEditStateAfter.css).to.not.have.key('display');
          expect(codePaneGitStateAfter.css.display).to.equal('block');
        });
    });

    it('instance config on, cookie config off', function () {
      updateGitInterfaceBoolean(true, false);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabMarkdownStateBefore = $orgs['#sg-code-tab-markdown'].getState();
      const panelMarkdownStateBefore = $orgs['#sg-code-panel-markdown'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const codePaneMarkdownNaStateBefore = $orgs['#sg-code-pane-markdown-na'].getState();
      const codeLanguageMarkdownStateBefore = $orgs['#sg-code-code-language-markdown'].getState();
      const btnMarkdownEditStateBefore = $orgs['#sg-code-btn-markdown-edit'].getState();
      const codePaneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const codePaneGitStateBefore = $orgs['#sg-code-pane-git'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabMarkdownStateAfter = $orgs['#sg-code-tab-markdown'].getState();
          const panelMarkdownStateAfter = $orgs['#sg-code-panel-markdown'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const codePaneMarkdownNaStateAfter = $orgs['#sg-code-pane-markdown-na'].getState();
          const codeLanguageMarkdownStateAfter = $orgs['#sg-code-code-language-markdown'].getState();
          const btnMarkdownEditStateAfter = $orgs['#sg-code-btn-markdown-edit'].getState();
          const codePaneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const codePaneGitStateAfter = $orgs['#sg-code-pane-git'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabMarkdownStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelMarkdownStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(panelMarkdownStateBefore.data).to.not.have.key('markdownSource');
          expect(tabActiveBefore).to.be.null;
          expect(codePaneMarkdownNaStateBefore.css.display).to.equal('block');
          expect(codeLanguageMarkdownStateBefore.html).to.be.empty;
          expect(btnMarkdownEditStateBefore.css).to.not.have.key('display');
          expect(codePaneGitNaStateBefore.css.display).to.equal('none');
          expect(codePaneGitStateBefore.css).to.not.have.key('display');

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabMarkdownStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelMarkdownStateAfter.classArray).to.include('sg-code-panel-active');
          expect(panelMarkdownStateAfter.data.markdownSource).to.equal('04-pages/00-homepage.md');
          expect(tabActiveAfter).to.equal('markdown');
          expect(codePaneMarkdownNaStateAfter.css).to.not.have.key('display');
          expect(codeLanguageMarkdownStateAfter.html).to.equal(`---
content_key: nav_content
---
*Component*

~*~ # Front Matter separator.

---
content_key: toggler_content
---
<button id="toggler">Toggler</button>
`);
          expect(btnMarkdownEditStateAfter.css).to.not.have.key('display');
          expect(codePaneGitNaStateAfter.css.display).to.equal('none');
          expect(codePaneGitStateAfter.css).to.not.have.key('display');
        });
    });

    it('instance config on, cookie config on, and git pull fails', function () {
      global.mockResponse.git_pull_status = 500;

      updateGitInterfaceBoolean(true, true);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabMarkdownStateBefore = $orgs['#sg-code-tab-markdown'].getState();
      const panelMarkdownStateBefore = $orgs['#sg-code-panel-markdown'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const codePaneMarkdownNaStateBefore = $orgs['#sg-code-pane-markdown-na'].getState();
      const codeLanguageMarkdownStateBefore = $orgs['#sg-code-code-language-markdown'].getState();
      const btnMarkdownEditStateBefore = $orgs['#sg-code-btn-markdown-edit'].getState();
      const codePaneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const codePaneGitStateBefore = $orgs['#sg-code-pane-git'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabMarkdownStateAfter = $orgs['#sg-code-tab-markdown'].getState();
          const panelMarkdownStateAfter = $orgs['#sg-code-panel-markdown'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const codePaneMarkdownNaStateAfter = $orgs['#sg-code-pane-markdown-na'].getState();
          const codeLanguageMarkdownStateAfter = $orgs['#sg-code-code-language-markdown'].getState();
          const btnMarkdownEditStateAfter = $orgs['#sg-code-btn-markdown-edit'].getState();
          const codePaneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const codePaneGitStateAfter = $orgs['#sg-code-pane-git'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabMarkdownStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelMarkdownStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(panelMarkdownStateBefore.data).to.not.have.key('markdownSource');
          expect(tabActiveBefore).to.be.null;
          expect(codePaneMarkdownNaStateBefore.css.display).to.equal('block');
          expect(codeLanguageMarkdownStateBefore.html).to.be.empty;
          expect(btnMarkdownEditStateBefore.css.display).to.not.equal(btnMarkdownEditStateAfter.css.display);
          expect(codePaneGitNaStateBefore.css.display).to.not.equal(codePaneGitNaStateAfter.css.display);
          expect(codePaneGitStateBefore.css).to.not.have.key('display');

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabMarkdownStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelMarkdownStateAfter.classArray).to.include('sg-code-panel-active');
          expect(panelMarkdownStateAfter.data.markdownSource).to.equal('04-pages/00-homepage.md');
          expect(tabActiveAfter).to.equal('markdown');
          expect(codePaneMarkdownNaStateAfter.css).to.not.have.key('display');
          expect(codeLanguageMarkdownStateAfter.html).to.equal(`---
content_key: nav_content
---
*Component*

~*~ # Front Matter separator.

---
content_key: toggler_content
---
<button id="toggler">Toggler</button>
`);
          expect(btnMarkdownEditStateAfter.css.display).to.equal('none');
          expect(codePaneGitNaStateAfter.css.display).to.equal('block');
          expect(codePaneGitStateAfter.css.display).to.equal('none');
        });
    });

    it('instance config on, cookie config on, and git pull succeeds', function () {
      global.mockResponse.git_pull_status = 200;

      updateGitInterfaceBoolean(true, true);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabMarkdownStateBefore = $orgs['#sg-code-tab-markdown'].getState();
      const panelMarkdownStateBefore = $orgs['#sg-code-panel-markdown'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const codePaneMarkdownNaStateBefore = $orgs['#sg-code-pane-markdown-na'].getState();
      const codeLanguageMarkdownStateBefore = $orgs['#sg-code-code-language-markdown'].getState();
      const btnMarkdownEditStateBefore = $orgs['#sg-code-btn-markdown-edit'].getState();
      const codePaneGitStateBefore = $orgs['#sg-code-pane-git'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabMarkdownStateAfter = $orgs['#sg-code-tab-markdown'].getState();
          const panelMarkdownStateAfter = $orgs['#sg-code-panel-markdown'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const codePaneMarkdownNaStateAfter = $orgs['#sg-code-pane-markdown-na'].getState();
          const codeLanguageMarkdownStateAfter = $orgs['#sg-code-code-language-markdown'].getState();
          const btnMarkdownEditStateAfter = $orgs['#sg-code-btn-markdown-edit'].getState();
          const codePaneGitStateAfter = $orgs['#sg-code-pane-git'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabMarkdownStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelMarkdownStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(panelMarkdownStateBefore.data).to.not.have.key('markdownSource');
          expect(tabActiveBefore).to.be.null;
          expect(codePaneMarkdownNaStateBefore.css.display).to.equal('block');
          expect(codeLanguageMarkdownStateBefore.html).to.be.empty;
          expect(btnMarkdownEditStateBefore.css.display).to.be.undefined;
          expect(codePaneGitStateBefore.css).to.not.have.key('display');

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabMarkdownStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelMarkdownStateAfter.classArray).to.include('sg-code-panel-active');
          expect(panelMarkdownStateAfter.data.markdownSource).to.equal('04-pages/00-homepage.md');
          expect(tabActiveAfter).to.equal('markdown');
          expect(codePaneMarkdownNaStateAfter.css).to.not.have.key('display');
          expect(codeLanguageMarkdownStateAfter.html).to.equal(`---
content_key: nav_content
---
*Component*

~*~ # Front Matter separator.

---
content_key: toggler_content
---
<button id="toggler">Toggler</button>
`);
          expect(btnMarkdownEditStateAfter.css).to.not.have.key('display');
          expect(codePaneGitStateAfter.css.display).to.equal('block');
        });
    });
  });

  describe('from Git tab', function () {
    before(function () {
      global.location.search = '?view=code';
      codeViewer.tabActive = 'git';
    });

    beforeEach(function () {
      global.mockResponse = {};
      codeViewer.stoked = false;

      $orgs['.sg-code-tab'].dispatchAction('removeClass', 'sg-code-tab-active');
      $orgs['.sg-code-panel'].dispatchAction('removeClass', 'sg-code-panel-active');
      dataSaver.removeValue('tabActive');
      $orgs['#sg-code-message-git-na'].dispatchAction('empty');
      $orgs['#sg-code-pane-git-na'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-pane-git'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-pane-git'].dispatchAction('removeClass', 'git-interface-on');
      $orgs['#sg-code-radio-git-on'].dispatchAction('prop', {checked: false});
    });

    it('instance config off, cookie config undefined', function () {
      updateGitInterfaceBoolean(false);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const panelGitStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();
      const radioGitOnStateBefore = $orgs['#sg-code-radio-git-on'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
          const panelGitStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();
          const radioGitOnStateAfter = $orgs['#sg-code-radio-git-on'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabGitStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelGitStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabActiveBefore).to.be.null;
          expect(paneGitNaStateBefore.css.display).to.equal('block');
          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneGitStateBefore.classArray).to.not.include('git-interface-on');
          expect(radioGitOnStateBefore.prop.checked).to.be.false;

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabGitStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelGitStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabActiveAfter).to.equal('git');
          expect(paneGitNaStateAfter.css.display).to.equal('none');
          expect(paneGitStateAfter.css.display).to.equal('block');
          expect(paneGitStateAfter.classArray).to.not.include('git-interface-on');
          expect(radioGitOnStateAfter.prop.checked).to.be.false;
        });
    });

    it('instance config off, cookie config off', function () {
      updateGitInterfaceBoolean(false, false);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const panelGitStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();
      const radioGitOnStateBefore = $orgs['#sg-code-radio-git-on'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
          const panelGitStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();
          const radioGitOnStateAfter = $orgs['#sg-code-radio-git-on'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabGitStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelGitStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabActiveBefore).to.be.null;
          expect(paneGitNaStateBefore.css.display).to.equal('block');
          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneGitStateBefore.classArray).to.not.include('git-interface-on');
          expect(radioGitOnStateBefore.prop.checked).to.be.false;

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabGitStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelGitStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabActiveAfter).to.equal('git');
          expect(paneGitNaStateAfter.css.display).to.equal('none');
          expect(paneGitStateAfter.css.display).to.equal('block');
          expect(paneGitStateAfter.classArray).to.not.include('git-interface-on');
          expect(radioGitOnStateAfter.prop.checked).to.be.false;
        });
    });

    it('instance config off, cookie config on, git not installed', function () {
      global.mockResponse.git_remote_status = 501;

      updateGitInterfaceBoolean(false, true);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const panelGitStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const messageGitNaStateBefore = $orgs['#sg-code-message-git-na'].getState();
      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
          const panelGitStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const messageGitNaStateAfter = $orgs['#sg-code-message-git-na'].getState();
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabGitStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelGitStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabActiveBefore).to.be.null;
          expect(messageGitNaStateBefore.html).to.not.equal(messageGitNaStateAfter.html);
          expect(paneGitNaStateBefore.css.display).to.equal('block');
          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneGitStateBefore.classArray).to.not.include('git-interface-on');

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabGitStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelGitStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabActiveAfter).to.equal('git');
          /* eslint-disable indent */
          expect(messageGitNaStateAfter.html).to.equal(
`<pre class="sg-code-pane-content-warning"><code>Command failed: git remote --verbose
'git' is not recognized as an internal or external command, operable program or batch file.</code></pre>`);
          /* eslint-enable indent */
          expect(paneGitNaStateAfter.css.display).to.equal('block');
          expect(paneGitStateAfter.css.display).to.equal('none');
          expect(paneGitStateAfter.classArray).to.not.include('git-interface-on');
        });
    });

    it('instance config off, cookie config on, git installed, and git-interface post fails', function () {
      global.mockResponse.git_remote_status = 500;

      updateGitInterfaceBoolean(false, true);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const panelGitStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
          const panelGitStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabGitStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelGitStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabActiveBefore).to.be.null;
          expect(paneGitNaStateBefore.css.display).to.equal('block');
          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneGitStateBefore.classArray).to.not.include('git-interface-on');

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabGitStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelGitStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabActiveAfter).to.equal('git');
          expect(paneGitNaStateAfter.css.display).to.equal('block');
          expect(paneGitStateAfter.css.display).to.equal('none');
          expect(paneGitStateAfter.classArray).to.not.include('git-interface-on');
        });
    });

    it('instance config off, cookie config on, git installed, and git-interface post succeeds', function () {
      global.mockResponse.git_remote_status = 200;

      updateGitInterfaceBoolean(false, true);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const panelGitStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();
      const radioGitOnStateBefore = $orgs['#sg-code-radio-git-on'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
          const panelGitStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();
          const radioGitOnStateAfter = $orgs['#sg-code-radio-git-on'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabGitStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelGitStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabActiveBefore).to.be.null;
          expect(paneGitNaStateBefore.css.display).to.equal('block');
          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneGitStateBefore.classArray).to.not.include('git-interface-on');
          expect(radioGitOnStateBefore.prop.checked).to.be.false;

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabGitStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelGitStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabActiveAfter).to.equal('git');
          expect(paneGitNaStateAfter.css.display).to.equal('none');
          expect(paneGitStateAfter.css.display).to.equal('block');
          expect(paneGitStateAfter.classArray).to.include('git-interface-on');
          expect(radioGitOnStateAfter.prop.checked).to.be.true;
        });
    });

    it('instance config on, cookie config undefined, git not installed', function () {
      global.mockResponse.git_remote_status = 501;

      updateGitInterfaceBoolean(true);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const panelGitStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const messageGitNaStateBefore = $orgs['#sg-code-message-git-na'].getState();
      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
          const panelGitStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const messageGitNaStateAfter = $orgs['#sg-code-message-git-na'].getState();
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabGitStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelGitStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabActiveBefore).to.be.null;
          expect(messageGitNaStateBefore.html).to.not.equal(messageGitNaStateAfter.html);
          expect(paneGitNaStateBefore.css.display).to.equal('block');
          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneGitStateBefore.classArray).to.not.include('git-interface-on');

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabGitStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelGitStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabActiveAfter).to.equal('git');
          /* eslint-disable indent */
          expect(messageGitNaStateAfter.html).to.equal(
`<pre class="sg-code-pane-content-warning"><code>Command failed: git remote --verbose
'git' is not recognized as an internal or external command, operable program or batch file.</code></pre>`);
          /* eslint-enable indent */
          expect(paneGitNaStateAfter.css.display).to.equal('block');
          expect(paneGitStateAfter.css.display).to.equal('none');
          expect(paneGitStateAfter.classArray).to.not.include('git-interface-on');
        });
    });

    it('instance config on, cookie config undefined, git installed, and git-interface post fails', function () {
      global.mockResponse.git_remote_status = 500;

      updateGitInterfaceBoolean(true);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const panelGitStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
          const panelGitStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabGitStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelGitStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabActiveBefore).to.be.null;
          expect(paneGitNaStateBefore.css.display).to.equal('block');
          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneGitStateBefore.classArray).to.not.include('git-interface-on');

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabGitStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelGitStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabActiveAfter).to.equal('git');
          expect(paneGitNaStateAfter.css.display).to.equal('block');
          expect(paneGitStateAfter.css.display).to.equal('none');
          expect(paneGitStateAfter.classArray).to.not.include('git-interface-on');
        });
    });

    it('instance config on, cookie config undefined, git installed, and git-interface post succeeds', function () {
      global.mockResponse.git_remote_status = 200;

      updateGitInterfaceBoolean(true);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const panelGitStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();
      const radioGitOnStateBefore = $orgs['#sg-code-radio-git-on'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
          const panelGitStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();
          const radioGitOnStateAfter = $orgs['#sg-code-radio-git-on'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabGitStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelGitStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabActiveBefore).to.be.null;
          expect(paneGitNaStateBefore.css.display).to.equal('block');
          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneGitStateBefore.classArray).to.not.include('git-interface-on');
          expect(radioGitOnStateBefore.prop.checked).to.be.false;

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabGitStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelGitStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabActiveAfter).to.equal('git');
          expect(paneGitNaStateAfter.css.display).to.equal('none');
          expect(paneGitStateAfter.css.display).to.equal('block');
          expect(paneGitStateAfter.classArray).to.include('git-interface-on');
          expect(radioGitOnStateAfter.prop.checked).to.be.true;
        });
    });

    it('instance config on, cookie config off', function () {
      updateGitInterfaceBoolean(true, false);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const panelGitStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();
      const radioGitOnStateBefore = $orgs['#sg-code-radio-git-on'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
          const panelGitStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();
          const radioGitOnStateAfter = $orgs['#sg-code-radio-git-on'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabGitStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelGitStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabActiveBefore).to.be.null;
          expect(paneGitNaStateBefore.css.display).to.equal('block');
          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneGitStateBefore.classArray).to.not.include('git-interface-on');
          expect(radioGitOnStateBefore.prop.checked).to.be.false;

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabGitStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelGitStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabActiveAfter).to.equal('git');
          expect(paneGitNaStateAfter.css.display).to.equal('none');
          expect(paneGitStateAfter.css.display).to.equal('block');
          expect(paneGitStateAfter.classArray).to.not.include('git-interface-on');
          expect(radioGitOnStateAfter.prop.checked).to.be.false;
        });
    });

    it('instance config on, cookie config on, git not installed', function () {
      global.mockResponse.git_remote_status = 501;

      updateGitInterfaceBoolean(true);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const panelGitStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const messageGitNaStateBefore = $orgs['#sg-code-message-git-na'].getState();
      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
          const panelGitStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const messageGitNaStateAfter = $orgs['#sg-code-message-git-na'].getState();
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabGitStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelGitStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabActiveBefore).to.be.null;
          expect(messageGitNaStateBefore.html).to.not.equal(messageGitNaStateAfter.html);
          expect(paneGitNaStateBefore.css.display).to.equal('block');
          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneGitStateBefore.classArray).to.not.include('git-interface-on');

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabGitStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelGitStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabActiveAfter).to.equal('git');
          /* eslint-disable indent */
          expect(messageGitNaStateAfter.html).to.equal(
`<pre class="sg-code-pane-content-warning"><code>Command failed: git remote --verbose
'git' is not recognized as an internal or external command, operable program or batch file.</code></pre>`);
          /* eslint-enable indent */
          expect(paneGitNaStateAfter.css.display).to.equal('block');
          expect(paneGitStateAfter.css.display).to.equal('none');
          expect(paneGitStateAfter.classArray).to.not.include('git-interface-on');
        });
    });

    it('instance config on, cookie config on, git installed, and git-interface post fails', function () {
      global.mockResponse.git_remote_status = 500;

      updateGitInterfaceBoolean(true);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const panelGitStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
          const panelGitStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabGitStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelGitStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabActiveBefore).to.be.null;
          expect(paneGitNaStateBefore.css.display).to.equal('block');
          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneGitStateBefore.classArray).to.not.include('git-interface-on');

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabGitStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelGitStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabActiveAfter).to.equal('git');
          expect(paneGitNaStateAfter.css.display).to.equal('block');
          expect(paneGitStateAfter.css.display).to.equal('none');
          expect(paneGitStateAfter.classArray).to.not.include('git-interface-on');
        });
    });

    it('instance config on, cookie config on, git installed, and git-interface post succeeds', function () {
      global.mockResponse.git_remote_status = 200;

      updateGitInterfaceBoolean(true);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const panelGitStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();
      const radioGitOnStateBefore = $orgs['#sg-code-radio-git-on'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
          const panelGitStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();
          const radioGitOnStateAfter = $orgs['#sg-code-radio-git-on'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabGitStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelGitStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabActiveBefore).to.be.null;
          expect(paneGitNaStateBefore.css.display).to.equal('block');
          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneGitStateBefore.classArray).to.not.include('git-interface-on');
          expect(radioGitOnStateBefore.prop.checked).to.be.false;

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabGitStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelGitStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabActiveAfter).to.equal('git');
          expect(paneGitNaStateAfter.css.display).to.equal('none');
          expect(paneGitStateAfter.css.display).to.equal('block');
          expect(paneGitStateAfter.classArray).to.include('git-interface-on');
          expect(radioGitOnStateAfter.prop.checked).to.be.true;
        });
    });

    // Must be run last in this `describe` block.
    it('gatekeeper fail', function () {
      global.mockResponse.git_remote_status = 403;

      $orgs['#sg-code-pane-git-na'].dispatchAction('css', {display: ''});
      updateGitInterfaceBoolean(false);

      const codeViewerStokedBefore = codeViewer.stoked;
      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const panelGitStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');
      const paneGitNaStateBefore = $orgs['#sg-code-pane-git-na'].getState();
      const paneGitStateBefore = $orgs['#sg-code-pane-git'].getState();
      const radioGitOnStateBefore = $orgs['#sg-code-radio-git-on'].getState();

      return codeViewer.stoke()
        .then(() => {
          const codeViewerStokedAfter = codeViewer.stoked;
          const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
          const panelGitStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');
          const paneGitNaStateAfter = $orgs['#sg-code-pane-git-na'].getState();
          const paneGitStateAfter = $orgs['#sg-code-pane-git'].getState();
          const radioGitOnStateAfter = $orgs['#sg-code-radio-git-on'].getState();

          expect(codeViewerStokedBefore).to.be.false;
          expect(tabGitStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelGitStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabActiveBefore).to.be.null;
          expect(paneGitNaStateBefore.css.display).to.not.equal(paneGitNaStateAfter.css.display);
          expect(paneGitStateBefore.css).to.not.have.key('display');
          expect(paneGitStateBefore.classArray).to.not.include('git-interface-on');
          expect(radioGitOnStateBefore.prop.checked).to.be.false;

          expect(codeViewerStokedAfter).to.be.true;
          expect(tabGitStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelGitStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabActiveAfter).to.equal('git');
          expect(paneGitNaStateAfter.css.display).to.equal('block');
          expect(paneGitStateAfter.css.display).to.equal('none');
          expect(paneGitStateAfter.classArray).to.not.include('git-interface-on');
          expect(radioGitOnStateAfter.prop.checked).to.be.false;
        });
    });
  });
});
