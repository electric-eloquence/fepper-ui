import {expect} from 'chai';

import fepperUi from '../unit';

const $orgs = fepperUi.requerio.$orgs;
const {
  annotationsViewer,
  codeViewer,
  dataSaver,
  uiProps
} = fepperUi;

const timeout = 10;

describe('codeViewer', function () {
  describe('.constructor()', function () {
    it('instantiates correctly', function () {
      expect(codeViewer.constructor.name).to.equal('CodeViewer');
      expect(Object.keys(codeViewer).length).to.equal(12);
      expect(codeViewer).to.have.property('receiveIframeMessage');
      expect(codeViewer).to.have.property('codeActive');
      expect(codeViewer).to.have.property('gitInterface');
      expect(codeViewer).to.have.property('markdownHttpPath');
      expect(codeViewer).to.have.property('markdownSource');
      expect(codeViewer).to.have.property('$orgs');
      expect(codeViewer).to.have.property('patternPartial');
      expect(codeViewer).to.have.property('requerio');
      expect(codeViewer).to.have.property('saving');
      expect(codeViewer).to.have.property('stoked');
      expect(codeViewer).to.have.property('tabActive');
      expect(codeViewer).to.have.property('viewall');
    });
  });

  describe('.stoke()', function () {
    beforeEach(function (done) {
      codeViewer.closeCode();

      setTimeout(() => {
        done();
      }, timeout);
    });

    it('opens code viewer with a "view=code" param', function (done) {
      global.location = {
        search: '?view=code'
      };

      const codeActiveBefore = codeViewer.codeActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.stoke();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTCodeAfter = $orgs['#sg-t-code'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(codeActiveBefore).to.be.false;
        expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
        expect(sgTCodeBefore.classArray).to.not.include('active');
        expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

        expect(codeViewer.codeActive).to.be.true;
        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(sgTCodeAfter.classArray).to.include('active');
        expect(sgViewContainerAfter.classArray).to.include('anim-ready');

        done();
      }, timeout);
    });

    it('opens code viewer with a "view=c" param', function (done) {
      global.location = {
        search: '?view=c'
      };

      const codeActiveBefore = codeViewer.codeActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.stoke();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTCodeAfter = $orgs['#sg-t-code'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(codeActiveBefore).to.be.false;
        expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
        expect(sgTCodeBefore.classArray).to.not.include('active');
        expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

        expect(codeViewer.codeActive).to.be.true;
        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(sgTCodeAfter.classArray).to.include('active');
        expect(sgViewContainerAfter.classArray).to.include('anim-ready');

        done();
      }, timeout);
    });

    it('opens code viewer with a "defaultShowPatternInfo": true config', function (done) {
      global.location = {
        search: ''
      };
      codeViewer.uiData.config.defaultShowPatternInfo = true;

      const codeActiveBefore = codeViewer.codeActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.stoke();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTCodeAfter = $orgs['#sg-t-code'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(codeActiveBefore).to.be.false;
        expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
        expect(sgTCodeBefore.classArray).to.not.include('active');
        expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

        expect(codeViewer.codeActive).to.be.true;
        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(sgTCodeAfter.classArray).to.include('active');
        expect(sgViewContainerAfter.classArray).to.include('anim-ready');

        codeViewer.uiData.config.defaultShowPatternInfo = false;

        done();
      }, timeout);
    });
  });

  describe('.activateTabAndPanel()', function () {
    before(function () {
      global.location = {
        protocol: 'http:',
        host: 'localhost:3000',
        search: '?p=pages-homepage'
      };

      codeViewer.stoke();
    });

    // Must test a tab + panel besides the Feplet default first. This way the Feplet tab + panel test can be accurate.
    it('activates the Markdown tab and panel for a pattern with Markdown - also tests .setPanelContent()', function () {
      global.mockResponse = {
        gatekeeper_status: 200
      };

      const panelStateBefore = $orgs['#sg-code-panel-markdown'].getState();
      const tabStateBefore = $orgs['#sg-code-tab-markdown'].getState();

      return codeViewer.activateTabAndPanel('markdown')
        .then(() => {
          const panelStateAfter = $orgs['#sg-code-panel-markdown'].getState();
          const tabStateAfter = $orgs['#sg-code-tab-markdown'].getState();

          expect(panelStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabStateBefore.classArray).to.not.include('sg-code-tab-active');

          expect(panelStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabStateAfter.classArray).to.include('sg-code-tab-active');
        });
    });

    it('activates the Feplet tab and panel - also tests .setPanelContent()', function () {
      const panelLocationHrefBefore = $orgs['#sg-code-panel-feplet'][0].contentWindow.location.href;
      const panelStateBefore = $orgs['#sg-code-panel-feplet'].getState();
      const tabStateBefore = $orgs['#sg-code-tab-feplet'].getState();
      codeViewer.patternPartial = 'components-region';

      return codeViewer.activateTabAndPanel('feplet')
        .then(() => {
          const panelLocationHrefAfter = $orgs['#sg-code-panel-feplet'][0].contentWindow.location.href;
          const panelStateAfter = $orgs['#sg-code-panel-feplet'].getState();
          const tabStateAfter = $orgs['#sg-code-tab-feplet'].getState();

          expect(panelLocationHrefBefore).to.not.equal(panelLocationHrefAfter);
          expect(panelStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabStateBefore.classArray).to.not.include('sg-code-tab-active');

          expect(panelLocationHrefAfter).to.equal('/mustache-browser?partial=components-region');
          expect(panelStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabStateAfter.classArray).to.include('sg-code-tab-active');
        });
    });

    it('activates Markdown tab and panel for pattern without Markdown via tabActive cookie on .stoke()\
', function () {
      global.location.search = '?p=elements-paragraph';

      codeViewer.stoke();

      const panelStateBefore = $orgs['#sg-code-panel-markdown'].getState();
      const tabStateBefore = $orgs['#sg-code-tab-markdown'].getState();

      fepperUi.dataSaver.updateValue('tabActive', 'markdown');
      codeViewer.stoke();

      codeViewer.receiveIframeMessage({
        origin: 'http://localhost:3000',
        data: {
          codeViewallClick: 'on',
          lineage: [],
          lineageR: [
            {
              lineagePattern: 'compounds-block',
              lineagePath: 'patterns/01-compounds-block/01-compounds-block.html',
              isHidden: false
            }
          ],
          missingPatterns: [],
          patternPartial: 'elements-paragraph',
          patternState: ''
        }
      });

      const panelStateAfter = $orgs['#sg-code-panel-markdown'].getState();
      const tabStateAfter = $orgs['#sg-code-tab-markdown'].getState();

      expect(panelStateBefore.classArray).to.not.include('sg-code-panel-active');
      expect(tabStateBefore.classArray).to.not.include('sg-code-tab-active');

      expect(panelStateAfter.classArray).to.include('sg-code-panel-active');
      expect(tabStateAfter.classArray).to.include('sg-code-tab-active');
    });

    it('activates Markdown tab and panel for viewall but without the option to edit', function () {
      global.location.search = '?p=viewall-pages';

      codeViewer.stoke();

      return codeViewer.activateTabAndPanel('feplet')
        .then(() => {
          const panelStateBefore = $orgs['#sg-code-panel-markdown'].getState();
          const tabStateBefore = $orgs['#sg-code-tab-markdown'].getState();
          const paneMarkdownStateBefore = $orgs['#sg-code-pane-markdown'].getState();
          const paneMarkdownEditStateBefore = $orgs['#sg-code-pane-markdown-edit'].getState();

          codeViewer.receiveIframeMessage({
            origin: 'http://localhost:3000',
            data: {
              lineage: [{
                lineagePattern: 'templates-page',
                lineagePath: 'patterns/03-templates-page/03-templates-page.html',
                isHidden: false
              }],
              lineageR: [],
              missingPartials: [],
              patternPartial: 'pages-homepage',
              patternState: '',
              viewall: true
            }
          });

          expect(panelStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(paneMarkdownStateBefore.css.display).to.be.undefined;
          expect(paneMarkdownEditStateBefore.css.display).to.be.undefined;

          return codeViewer.activateTabAndPanel('markdown');
        })
        .then(() => {
          const panelStateAfter = $orgs['#sg-code-panel-markdown'].getState();
          const tabStateAfter = $orgs['#sg-code-tab-markdown'].getState();
          const paneMarkdownStateAfter = $orgs['#sg-code-pane-markdown'].getState();
          const paneMarkdownEditStateAfter = $orgs['#sg-code-pane-markdown-edit'].getState();

          expect(panelStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabStateAfter.classArray).to.include('sg-code-tab-active');
          expect(paneMarkdownStateAfter.css.display).to.equal('block');
          expect(paneMarkdownEditStateAfter.css.display).to.be.undefined;
        });
    });

    it('activates Git tab and panel but does not set panel content if not stoked', function () {
      global.mockResponse = {
        gatekeeper_status: 200,
        git_remote_status: 200
      };
      codeViewer.patternPartial = 'elements-paragraph';
      codeViewer.stoked = false;

      $orgs['.sg-code-panel'].dispatchAction('removeClass', 'sg-code-panel-active');
      $orgs['.sg-code-tab'].dispatchAction('removeClass', 'sg-code-tab-active');

      const paneStateBefore = $orgs['#sg-code-pane-git'].getState();
      const panelStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabStateBefore = $orgs['#sg-code-tab-git'].getState();

      return codeViewer.activateTabAndPanel('git')
        .then(() => {
          const paneStateAfter = $orgs['#sg-code-pane-git'].getState();
          const panelStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabStateAfter = $orgs['#sg-code-tab-git'].getState();

          expect(paneStateBefore.html).to.equal(paneStateAfter.html);
          expect(panelStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabStateBefore.classArray).to.not.include('sg-code-tab-active');

          expect(paneStateAfter.html).to.be.null;
          expect(panelStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabStateAfter.classArray).to.include('sg-code-tab-active');
        });
    });

    it('activates Git tab and panel but does not set panel content if git pull fails', function () {
      codeViewer.patternPartial = 'elements-paragraph';

      dataSaver.removeValue('tabActive');
      $orgs['.sg-code-panel'].dispatchAction('removeClass', 'sg-code-panel-active');
      $orgs['.sg-code-tab'].dispatchAction('removeClass', 'sg-code-tab-active');
      $orgs['#sg-code-message-git-na'].dispatchAction('html', 'Command failed: git pull');

      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const panelGitStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');

      return codeViewer.activateTabAndPanel('git')
        .then(() => {
          const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
          const panelGitStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');

          expect(tabGitStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelGitStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabActiveBefore).to.be.null;

          expect(tabGitStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelGitStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabActiveAfter).to.equal('git');
        });
    });

    it('activates Git tab and panel but does not set panel content if git push fails', function () {
      codeViewer.patternPartial = 'elements-paragraph';

      dataSaver.removeValue('tabActive');
      $orgs['.sg-code-panel'].dispatchAction('removeClass', 'sg-code-panel-active');
      $orgs['.sg-code-tab'].dispatchAction('removeClass', 'sg-code-tab-active');
      $orgs['#sg-code-message-git-na'].dispatchAction('html', 'Command failed: git push');

      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const panelGitStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabActiveBefore = dataSaver.findValue('tabActive');

      return codeViewer.activateTabAndPanel('git')
        .then(() => {
          const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
          const panelGitStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabActiveAfter = dataSaver.findValue('tabActive');

          expect(tabGitStateBefore.classArray).to.not.include('sg-code-tab-active');
          expect(panelGitStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabActiveBefore).to.be.null;

          expect(tabGitStateAfter.classArray).to.include('sg-code-tab-active');
          expect(panelGitStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabActiveAfter).to.equal('git');
        });
    });

    it('activates Git tab and panel and sets panel content if stoked', function () {
      codeViewer.patternPartial = 'elements-paragraph';
      codeViewer.stoked = true;

      $orgs['.sg-code-panel'].dispatchAction('removeClass', 'sg-code-panel-active');
      $orgs['.sg-code-tab'].dispatchAction('removeClass', 'sg-code-tab-active');

      const paneStateBefore = $orgs['#sg-code-pane-git'].getState();
      const panelStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabStateBefore = $orgs['#sg-code-tab-git'].getState();

      return codeViewer.activateTabAndPanel('git')
        .then(() => {
          const paneStateAfter = $orgs['#sg-code-pane-git'].getState();
          const panelStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabStateAfter = $orgs['#sg-code-tab-git'].getState();

          expect(paneStateBefore.html).to.equal(paneStateAfter.html);
          expect(panelStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabStateBefore.classArray).to.not.include('sg-code-tab-active');

          expect(paneStateAfter.html).to.be.null;
          expect(panelStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabStateAfter.classArray).to.include('sg-code-tab-active');
        });
    });

    it('activates the Requerio tab and panel - also tests .setPanelContent()', function () {
      const panelStateBefore = $orgs['#sg-code-panel-requerio'].getState();
      const tabStateBefore = $orgs['#sg-code-tab-requerio'].getState();
      codeViewer.patternPartial = 'components-region';

      return codeViewer.activateTabAndPanel('requerio')
        .then(() => {
          const panelStateAfter = $orgs['#sg-code-panel-requerio'].getState();
          const tabStateAfter = $orgs['#sg-code-tab-requerio'].getState();

          expect(panelStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabStateBefore.classArray).to.not.include('sg-code-tab-active');

          expect(panelStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabStateAfter.classArray).to.include('sg-code-tab-active');
        });
    });
  });

  describe('.activateMarkdownTextarea()', function () {
    it('puts the cursor focus on the Markdown textarea', function () {
      $orgs['#sg-code-pre-language-markdown']
        .dispatchAction('width', 996)
        .dispatchAction('height', 100);

      const documentStateBefore = $orgs.document.getState();
      const textareaStateBefore = $orgs['#sg-code-textarea-markdown'].getState();

      codeViewer.activateMarkdownTextarea('markdown');

      const documentStateAfter = $orgs.document.getState();
      const paneStateAfter = $orgs['#sg-code-pane-markdown'].getState();
      const textareaStateAfter = $orgs['#sg-code-textarea-markdown'].getState();

      expect(documentStateBefore.activeOrganism).to.be.null;
      expect(textareaStateBefore.height).to.not.equal(textareaStateAfter.height);
      expect(textareaStateBefore.css).to.not.have.key('width');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-code-textarea-markdown');
      expect(paneStateAfter.css).to.not.have.key('display');
      expect(textareaStateAfter.height).to.equal(121);
      expect(textareaStateAfter.width).to.equal(996);
    });
  });

  describe('.deActivateMarkdownTextarea()', function () {
    it('removes focus from and hides the Markdown textarea and instead shows the static Markdown pane', function () {
      const documentStateBefore = $orgs.document.getState();
      const paneStateBefore = $orgs['#sg-code-pane-markdown'].getState();
      const paneEditStateBefore = $orgs['#sg-code-pane-markdown-edit'].getState();

      codeViewer.deActivateMarkdownTextarea();

      const documentStateAfter = $orgs.document.getState();
      const paneStateAfter = $orgs['#sg-code-pane-markdown'].getState();
      const paneEditStateAfter = $orgs['#sg-code-pane-markdown-edit'].getState();

      expect(documentStateBefore.activeOrganism).to.equal('#sg-code-textarea-markdown');
      expect(paneStateBefore.css).to.not.have.key('display');
      expect(paneEditStateBefore.css.display).to.equal('block');

      expect(documentStateAfter.activeOrganism).to.be.null;
      expect(paneStateAfter.css.display).to.equal('block');
      expect(paneEditStateAfter.css).to.not.have.key('display');
    });
  });

  describe('.gitDiff()', function () {
    before(function () {
      codeViewer.gitInterface = true;
      codeViewer.markdownSource = '04-pages/00-homepage.md';
    });

    it('responds with status 304 if the Markdown edit is not different from the last version', function () {
      global.mockResponse = {
        git_diff_status: 304
      };

      return codeViewer.gitDiff()
        .then((response) => {
          expect(response).to.be.an('object');
          expect(response.status).to.equal(304);
        });
    });

    it('responds with a non-empty string if the Markdown edit is different from the last version', function () {
      global.mockResponse = {
        git_diff_status: 200
      };

      return codeViewer.gitDiff()
        .then((response) => {
          expect(response).to.be.a('string');
          expect(response).to.not.be.empty;
        });
    });

    it('responds with undefined if the GUI shows that Git is not available', function () {
      $orgs['#sg-code-pane-git-na'].dispatchAction('css', {display: 'block'});

      return codeViewer.gitDiff()
        .then((response) => {
          expect(response).to.be.undefined;

          $orgs['#sg-code-pane-git-na'].dispatchAction('css', {display: ''});
        });
    });

    it('responds with undefined if gitInterface is off', function () {
      codeViewer.gitInterface = false;

      return codeViewer.gitDiff()
        .then((response) => {
          expect(response).to.be.undefined;
        });
    });
  });

  // Tests .fetchGitCommand()
  describe('.revisionAdd()', function () {
    const relPath = '04-pages/00-homepage.mustache';

    it('rejects with error on gatekeeper fail', function () {
      global.mockResponse = {
        git_add_status: 403
      };

      return codeViewer.revisionAdd(relPath)
        .catch((err) => {
          expect(err.message).to.equal('Command failed: git add 04-pages/00-homepage.mustache');
        });
    });

    it('rejects with statusText "Not Implemented" if git not installed on server', function () {
      global.mockResponse = {
        git_add_status: 501
      };

      return codeViewer.revisionAdd(relPath)
        .catch((err) => {
          expect(err.message).to.equal(`Command failed: git remote --verbose
'git' is not recognized as an internal or external command, operable program or batch file.`);
        });
    });

    it('rejects with statusText "Internal Server Error" if server errors while running command', function () {
      global.mockResponse = {
        git_add_status: 500
      };

      return codeViewer.revisionAdd(relPath)
        .catch((err) => {
          expect(err.message).to.equal('Command failed: git add 04-pages/00-homepage.mustache');
        });
    });

    it('responds with statusText "OK" on success', function () {
      global.mockResponse = {
        git_add_status: 200
      };

      return codeViewer.revisionAdd(relPath)
        .then((responseText) => {
          expect(responseText).to.equal('OK');
        });
    });
  });

  // Tests .fetchGitCommand()
  describe('.revisionCommit()', function () {
    const body = 'args[0]=commit&args[1]=-m&args[2]=message';

    it('rejects with error on gatekeeper fail', function () {
      global.mockResponse = {
        git_commit_status: 403
      };

      return codeViewer.revisionCommit(body)
        .catch((err) => {
          expect(err.message).to.equal('Command failed: git commit');
        });
    });

    it('rejects with statusText "Not Implemented" if git not installed on server', function () {
      global.mockResponse = {
        git_commit_status: 501
      };

      return codeViewer.revisionCommit(body)
        .catch((err) => {
          expect(err.message).to.equal(`Command failed: git remote --verbose
'git' is not recognized as an internal or external command, operable program or batch file.`);
        });
    });

    it('rejects with statusText "Internal Server Error" if server errors while running command', function () {
      global.mockResponse = {
        git_commit_status: 500
      };

      return codeViewer.revisionCommit(body)
        .catch((err) => {
          expect(err.message).to.equal('Command failed: git commit');
        });
    });

    it('responds with statusText "OK" on success', function () {
      global.mockResponse = {
        git_commit_status: 200
      };

      return codeViewer.revisionCommit(body)
        .then((responseText) => {
          expect(responseText).to.equal('OK');
        });
    });
  });

  // Tests .fetchGitCommand()
  describe('.revisionPush()', function () {
    it('rejects with error on gatekeeper fail', function () {
      global.mockResponse = {
        git_push_status: 403
      };

      return codeViewer.revisionPush()
        .catch((err) => {
          expect(err.message).to.equal('Command failed: git push');
        });
    });

    it('rejects with statusText "Not Implemented" if git not installed on server', function () {
      global.mockResponse = {
        git_push_status: 501
      };

      return codeViewer.revisionPush()
        .catch((err) => {
          expect(err.message).to.equal(`Command failed: git remote --verbose
'git' is not recognized as an internal or external command, operable program or batch file.`);
        });
    });

    it('rejects with statusText "Internal Server Error" if server errors while running command', function () {
      global.mockResponse = {
        git_push_status: 500
      };

      return codeViewer.revisionPush()
        .catch((err) => {
          expect(err.message).to.equal('Command failed: git push');
        });
    });

    it('responds with statusText "OK" on success', function () {
      global.mockResponse = {
        git_push_status: 200
      };

      return codeViewer.revisionPush()
        .then((responseText) => {
          expect(responseText).to.equal('OK');
        });
    });
  });

  describe('.markdownSave()', function () {
    it('rejects with statusText "Forbidden" on gatekeeper fail', function () {
      global.mockResponse = {
        gatekeeper_status: 403
      };
      codeViewer.saving = true;

      $orgs['#sg-code-pane-markdown-load-anim'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-pane-markdown-commit'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-textarea-commit-message'].dispatchAction('val', 'message');

      const codeViewerSavingBefore = codeViewer.saving;
      const paneMarkdownLoadAnimStateBefore = $orgs['#sg-code-pane-markdown-load-anim'].getState();
      const paneMarkdownNaStateBefore = $orgs['#sg-code-pane-markdown-na'].getState();
      const paneMarkdownStateBefore = $orgs['#sg-code-pane-markdown'].getState();
      const paneMarkdownCommitStateBefore = $orgs['#sg-code-pane-markdown-commit'].getState();
      const textareaCommitMessageStateBefore = $orgs['#sg-code-textarea-commit-message'].getState();

      return codeViewer.markdownSave()
        .then((rejection) => {
          expect(rejection.statusText).to.equal('Forbidden');

          const codeViewerSavingAfter = codeViewer.saving;
          const paneMarkdownLoadAnimStateAfter = $orgs['#sg-code-pane-markdown-load-anim'].getState();
          const paneMarkdownNaStateAfter = $orgs['#sg-code-pane-markdown-na'].getState();
          const paneMarkdownStateAfter = $orgs['#sg-code-pane-markdown'].getState();
          const paneMarkdownCommitStateAfter = $orgs['#sg-code-pane-markdown-commit'].getState();
          const textareaCommitMessageStateAfter = $orgs['#sg-code-textarea-commit-message'].getState();

          expect(codeViewerSavingBefore).to.be.true;
          expect(paneMarkdownLoadAnimStateBefore.css.display).to.not.equal(paneMarkdownLoadAnimStateAfter.css.display);
          expect(paneMarkdownNaStateBefore.textContent).to.not.equal(paneMarkdownNaStateAfter.textContent);
          expect(paneMarkdownStateBefore.css.display).to.equal(paneMarkdownStateAfter.css.display);
          expect(paneMarkdownCommitStateBefore.css.display).to.equal(paneMarkdownCommitStateAfter.css.display);
          expect(textareaCommitMessageStateBefore.val).to.equal(textareaCommitMessageStateAfter.val);

          expect(codeViewerSavingAfter).to.be.false;
          expect(paneMarkdownLoadAnimStateAfter.css).to.not.have.key('display');
          expect(paneMarkdownNaStateAfter.textContent).to.equal(`
  ERROR! You can only use the Markdown Editor on the machine that is running this Fepper instance!
  If you are on this machine, you may need to resync this browser with Fepper.
  Please go to the command line and quit this Fepper instance. Then run fp (not fp restart).
`);
        });
    });

    it('rejects with statusText "Internal Server Error" if server errors while running command', function () {
      global.mockResponse = {
        markdown_save_status: 500
      };
      codeViewer.saving = true;

      $orgs['#sg-code-pane-markdown-load-anim'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-pane-markdown-edit'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-pane-markdown-commit'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-textarea-commit-message'].dispatchAction('val', 'message');

      const codeViewerSavingBefore = codeViewer.saving;
      const paneMarkdownLoadAnimStateBefore = $orgs['#sg-code-pane-markdown-load-anim'].getState();
      const paneMarkdownStateBefore = $orgs['#sg-code-pane-markdown'].getState();
      const paneMarkdownEditStateBefore = $orgs['#sg-code-pane-markdown-edit'].getState();
      const paneMarkdownCommitStateBefore = $orgs['#sg-code-pane-markdown-commit'].getState();
      const textareaCommitMessageStateBefore = $orgs['#sg-code-textarea-commit-message'].getState();

      return codeViewer.markdownSave()
        .then((rejection) => {
          expect(rejection.statusText).to.equal('Internal Server Error');

          const codeViewerSavingAfter = codeViewer.saving;
          const paneMarkdownLoadAnimStateAfter = $orgs['#sg-code-pane-markdown-load-anim'].getState();
          const paneMarkdownStateAfter = $orgs['#sg-code-pane-markdown'].getState();
          const paneMarkdownEditStateAfter = $orgs['#sg-code-pane-markdown-edit'].getState();
          const paneMarkdownCommitStateAfter = $orgs['#sg-code-pane-markdown-commit'].getState();
          const textareaCommitMessageStateAfter = $orgs['#sg-code-textarea-commit-message'].getState();

          expect(codeViewerSavingBefore).to.be.true;
          expect(paneMarkdownLoadAnimStateBefore.css.display).to.not.equal(paneMarkdownLoadAnimStateAfter.css.display);
          expect(paneMarkdownStateBefore.css.display).to.not.equal(paneMarkdownStateAfter.css.display);
          expect(paneMarkdownEditStateBefore.css.display).to.not.equal(paneMarkdownEditStateAfter.css.display);
          expect(paneMarkdownCommitStateBefore.css.display).to.not.equal(paneMarkdownCommitStateAfter.css.display);
          expect(textareaCommitMessageStateBefore.val).to.not.equal(textareaCommitMessageStateAfter.val);

          expect(codeViewerSavingAfter).to.be.false;
          expect(paneMarkdownLoadAnimStateAfter.css).to.not.have.key('display');
          expect(paneMarkdownStateAfter.css.display).to.equal('block');
          expect(paneMarkdownEditStateAfter.css).to.not.have.key('display');
          expect(paneMarkdownCommitStateAfter.css).to.not.have.key('display');
          expect(textareaCommitMessageStateAfter.val).to.equal('');
        });
    });

    it('responds with statusText "Not Modified" if the Markdown was not modified', function () {
      global.mockResponse = {
        markdown_save_status: 304
      };
      codeViewer.saving = true;

      $orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: ''});

      const codeViewerSavingBefore = codeViewer.saving;
      const paneMarkdownStateBefore = $orgs['#sg-code-pane-markdown'].getState();

      return codeViewer.markdownSave()
        .then((response) => {
          expect(response.statusText).to.equal('Not Modified');

          const codeViewerSavingAfter = codeViewer.saving;
          const paneMarkdownStateAfter = $orgs['#sg-code-pane-markdown'].getState();

          expect(codeViewerSavingBefore).to.be.true;
          expect(paneMarkdownStateBefore.css.display).to.not.equal(paneMarkdownStateAfter.css.display);

          expect(codeViewerSavingAfter).to.be.false;
          expect(paneMarkdownStateAfter.css.display).to.equal('block');
        });
    });

    it('responds with statusText "OK" and prompts for git commit message after saving correctly with gitInterface on\
', function () {
      global.mockResponse = {
        markdown_save_status: 200
      };
      codeViewer.gitInterface = true;
      codeViewer.patternPartial = 'pages-homepage';
      codeViewer.saving = true;

      $orgs['#sg-code-pane-git-na'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-pane-markdown-load-anim'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-panel-markdown'].dispatchAction('data', {markdownSource: null});
      $orgs['#sg-code-pane-markdown-edit'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-pane-markdown-commit'].dispatchAction('css', {display: ''});

      const codeViewerSavingBefore = codeViewer.saving;
      const paneMarkdownLoadAnimStateBefore = $orgs['#sg-code-pane-markdown-load-anim'].getState();
      const panelMarkdownStateBefore = $orgs['#sg-code-panel-markdown'].getState();
      const paneMarkdownEditStateBefore = $orgs['#sg-code-pane-markdown-edit'].getState();
      const paneMarkdownCommitStateBefore = $orgs['#sg-code-pane-markdown-commit'].getState();
      const documentStateBefore = $orgs.document.getState();

      return codeViewer.markdownSave()
        .then((response) => {
          expect(response.statusText).to.equal('OK');

          const codeViewerSavingAfter = codeViewer.saving;
          const paneMarkdownLoadAnimStateAfter = $orgs['#sg-code-pane-markdown-load-anim'].getState();
          const panelMarkdownStateAfter = $orgs['#sg-code-panel-markdown'].getState();
          const paneMarkdownEditStateAfter = $orgs['#sg-code-pane-markdown-edit'].getState();
          const paneMarkdownCommitStateAfter = $orgs['#sg-code-pane-markdown-commit'].getState();
          const documentStateAfter = $orgs.document.getState();

          expect(codeViewerSavingBefore).to.be.true;
          expect(paneMarkdownLoadAnimStateBefore.css.display).to.not.equal(paneMarkdownLoadAnimStateAfter.css.display);
          expect(panelMarkdownStateBefore.data.markdownSource)
            .to.not.equal(panelMarkdownStateAfter.data.markdownSource);
          expect(paneMarkdownEditStateBefore.css.display).to.not.equal(paneMarkdownEditStateAfter.css.display);
          expect(paneMarkdownCommitStateBefore.css.display).to.not.equal(paneMarkdownCommitStateAfter.css.display);
          expect(documentStateBefore.activeOrganism).to.be.null;

          expect(codeViewerSavingAfter).to.be.false;
          expect(paneMarkdownLoadAnimStateAfter.css).to.not.have.key('display');
          expect(panelMarkdownStateAfter.data.markdownSource).to.equal('04-pages/00-homepage.md');
          expect(paneMarkdownEditStateAfter.css).to.not.have.key('display');
          expect(paneMarkdownCommitStateAfter.css.display).to.equal('block');
          expect(documentStateAfter.activeOrganism).to.equal('#sg-code-textarea-commit-message');
        });
    });

    it('responds with statusText "OK" after saving correctly with gitInterface off', function () {
      global.mockResponse = {
        markdown_save_status: 200
      };
      codeViewer.gitInterface = false;
      codeViewer.saving = true;

      $orgs['#sg-code-pane-markdown-load-anim'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-pane-markdown-edit'].dispatchAction('css', {display: 'block'});

      const codeViewerSavingBefore = codeViewer.saving;
      const paneMarkdownEditStateBefore = $orgs['#sg-code-pane-markdown-edit'].getState();

      return codeViewer.markdownSave()
        .then((response) => {
          expect(response.statusText).to.equal('OK');

          const codeViewerSavingAfter = codeViewer.saving;
          const paneMarkdownEditStateAfter = $orgs['#sg-code-pane-markdown-edit'].getState();

          expect(codeViewerSavingBefore).to.be.true;
          expect(paneMarkdownEditStateBefore.css.display).to.not.equal(paneMarkdownEditStateAfter.css.display);

          expect(codeViewerSavingAfter).to.be.false;
          expect(paneMarkdownEditStateAfter.css).to.not.have.key('display');
        });
    });
  });

  describe('.setPanelContent(\'markdown\')', function () {
    it('fails if it does not pass gatekeeper', function () {
      global.mockResponse = {
        gatekeeper_status: 403
      };

      $orgs['#sg-code-pane-markdown-na'].dispatchAction('css', {display: ''});

      const paneStateBefore = $orgs['#sg-code-pane-markdown'].getState();
      const paneMarkdownNaStateBefore = $orgs['#sg-code-pane-markdown-na'].getState();

      return codeViewer.setPanelContent('markdown')
        .then(() => {
          const paneStateAfter = $orgs['#sg-code-pane-markdown'].getState();
          const paneMarkdownNaStateAfter = $orgs['#sg-code-pane-markdown-na'].getState();

          expect(paneStateBefore.css.display).to.equal('block');
          expect(paneMarkdownNaStateBefore.css).to.not.have.key('display');

          expect(paneStateAfter.css).to.not.have.key('display');
          expect(paneMarkdownNaStateAfter.css.display).to.equal('block');
        });
    });
  });

  describe('.switchTab()', function () {
    before(function (done) {
      codeViewer.openCode();

      setTimeout(() => {
        codeViewer.activateTabAndPanel('feplet')
          .then(() => {
            done();
          });
      }, timeout);
    });

    after(function (done) {
      codeViewer.closeCode();

      setTimeout(() => {
        done();
      }, timeout);
    });

    it('switches to the second tab/panel when switching to the right of the first tab/panel', function () {
      global.mockResponse = {
        gatekeeper_status: 200
      };

      const sgCodeTabState0Before = $orgs['.sg-code-tab'].getState(0);
      const sgCodeTabState1Before = $orgs['.sg-code-tab'].getState(1);

      expect(sgCodeTabState0Before.classArray).to.include('sg-code-tab-active');
      expect(sgCodeTabState1Before.classArray).to.not.include('sg-code-tab-active');

      codeViewer.switchTab(1);

      const sgCodeTabState0After = $orgs['.sg-code-tab'].getState(0);
      const sgCodeTabState1After = $orgs['.sg-code-tab'].getState(1);

      expect(sgCodeTabState0After.classArray).to.not.include('sg-code-tab-active');
      expect(sgCodeTabState1After.classArray).to.include('sg-code-tab-active');
    });

    it('switches to the first tab/panel when switching to the left of the second tab/panel', function () {
      global.mockResponse = {
        gatekeeper_status: 200
      };

      const sgCodeTabState0Before = $orgs['.sg-code-tab'].getState(0);
      const sgCodeTabState1Before = $orgs['.sg-code-tab'].getState(1);

      expect(sgCodeTabState0Before.classArray).to.not.include('sg-code-tab-active');
      expect(sgCodeTabState1Before.classArray).to.include('sg-code-tab-active');

      codeViewer.switchTab(-1);

      const sgCodeTabState0After = $orgs['.sg-code-tab'].getState(0);
      const sgCodeTabState1After = $orgs['.sg-code-tab'].getState(1);

      expect(sgCodeTabState0After.classArray).to.include('sg-code-tab-active');
      expect(sgCodeTabState1After.classArray).to.not.include('sg-code-tab-active');
    });

    it('switches to the last tab/panel when switching to the left of the first tab/panel', function () {
      global.mockResponse = {
        gatekeeper_status: 200
      };

      const numberOfTabs = $orgs['.sg-code-tab'].getState().members;
      const lastIndex = numberOfTabs - 1;

      const sgCodeTabState0Before = $orgs['.sg-code-tab'].getState(0);
      const sgCodeTabStateLastBefore = $orgs['.sg-code-tab'].getState(lastIndex);

      expect(sgCodeTabState0Before.classArray).to.include('sg-code-tab-active');
      expect(sgCodeTabStateLastBefore.classArray).to.not.include('sg-code-tab-active');

      codeViewer.switchTab(-1);

      const sgCodeTabState0After = $orgs['.sg-code-tab'].getState(0);
      const sgCodeTabStateLastAfter = $orgs['.sg-code-tab'].getState(lastIndex);

      expect(sgCodeTabState0After.classArray).to.not.include('sg-code-tab-active');
      expect(sgCodeTabStateLastAfter.classArray).to.include('sg-code-tab-active');
    });

    it('switches to the first tab/panel when switching to the right of the last tab/panel', function () {
      global.mockResponse = {
        gatekeeper_status: 200
      };

      const numberOfTabs = $orgs['.sg-code-tab'].getState().members;
      const lastIndex = numberOfTabs - 1;

      const sgCodeTabState0Before = $orgs['.sg-code-tab'].getState(0);
      const sgCodeTabStateLastBefore = $orgs['.sg-code-tab'].getState(lastIndex);

      expect(sgCodeTabState0Before.classArray).to.not.include('sg-code-tab-active');
      expect(sgCodeTabStateLastBefore.classArray).to.include('sg-code-tab-active');

      codeViewer.switchTab(1);

      const sgCodeTabState0After = $orgs['.sg-code-tab'].getState(0);
      const sgCodeTabStateLastAfter = $orgs['.sg-code-tab'].getState(lastIndex);

      expect(sgCodeTabState0After.classArray).to.include('sg-code-tab-active');
      expect(sgCodeTabStateLastAfter.classArray).to.not.include('sg-code-tab-active');
    });
  });

  describe('.toggleCode()', function () {
    after(function (done) {
      codeViewer.closeCode();

      setTimeout(() => {
        done();
      }, timeout);
    });

    it('toggles on - also tests .openCode()', function (done) {
      codeViewer.closeCode();
      $orgs['#sg-t-code'].dispatchAction('removeClass', 'active');

      setTimeout(() => {
        const codeActiveBefore = codeViewer.codeActive;
        const sgTCodeBefore = $orgs['#sg-t-code'].getState();
        const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

        codeViewer.toggleCode();

        setTimeout(() => {
          const sgTCodeAfter = $orgs['#sg-t-code'].getState();
          const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

          expect(codeActiveBefore).to.be.false;
          expect(sgTCodeBefore.classArray).to.not.include('active');
          expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

          expect(codeViewer.codeActive).to.be.true;
          expect(sgTCodeAfter.classArray).to.include('active');
          expect(sgViewContainerAfter.classArray).to.include('anim-ready');

          done();
        }, timeout);
      }, timeout);
    });

    it('toggles off - also tests .closeCode()', function (done) {
      const codeActiveBefore = codeViewer.codeActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.toggleCode();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTCodeAfter = $orgs['#sg-t-code'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(codeActiveBefore).to.be.true;
        expect(patternlabBodyBefore.classArray).to.include('dock-open');
        expect(sgTCodeBefore.classArray).to.include('active');
        expect(sgViewContainerBefore.classArray).to.include('anim-ready');

        expect(codeViewer.codeActive).to.be.false;
        expect(patternlabBodyAfter.classArray).to.not.include('dock-open');
        expect(sgTCodeAfter.classArray).to.not.include('active');
        expect(sgViewContainerAfter.classArray).to.not.include('anim-ready');

        done();
      }, timeout);
    });

    it('switches from annotations viewer to code viewer', function (done) {
      annotationsViewer.openAnnotations();
      $orgs['#sg-t-code'].dispatchAction('removeClass', 'active');

      setTimeout(() => {
        const annotationsActiveBefore = annotationsViewer.annotationsActive;
        const codeActiveBefore = codeViewer.codeActive;
        const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
        const sgAnnotationsContainerBefore = $orgs['#sg-annotations-container'].getState();
        const sgCodeContainerBefore = $orgs['#sg-code-container'].getState();
        const sgTAnnotationsBefore = $orgs['#sg-t-annotations'].getState();
        const sgTCodeBefore = $orgs['#sg-t-code'].getState();
        const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

        codeViewer.toggleCode();

        setTimeout(() => {
          const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
          const sgAnnotationsContainerAfter = $orgs['#sg-annotations-container'].getState();
          const sgCodeContainerAfter = $orgs['#sg-code-container'].getState();
          const sgTAnnotationsAfter = $orgs['#sg-t-annotations'].getState();
          const sgTCodeAfter = $orgs['#sg-t-code'].getState();
          const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

          expect(annotationsActiveBefore).to.be.true;
          expect(codeActiveBefore).to.be.false;
          expect(patternlabBodyBefore.classArray).to.include('dock-open');
          expect(sgAnnotationsContainerBefore.classArray).to.include('active');
          expect(sgCodeContainerBefore.classArray).to.not.include('active');
          expect(sgTAnnotationsBefore.classArray).to.include('active');
          expect(sgTCodeBefore.classArray).to.not.include('active');
          expect(sgViewContainerBefore.classArray).to.include('anim-ready');

          expect(annotationsViewer.annotationsActive).to.be.false;
          expect(codeViewer.codeActive).to.be.true;
          expect(patternlabBodyAfter.classArray).to.include('dock-open');
          expect(sgAnnotationsContainerAfter.classArray).to.not.include('active');
          expect(sgCodeContainerAfter.classArray).to.include('active');
          expect(sgTAnnotationsAfter.classArray).to.not.include('active');
          expect(sgTCodeAfter.classArray).to.include('active');
          expect(sgViewContainerAfter.classArray).to.include('anim-ready');

          done();
        }, timeout);
      }, timeout);
    });
  });

  describe('.updateMetadata()', function () {
    beforeEach(function () {
      $orgs['#sg-code-container'].dispatchAction('attr', {'data-pattern-partial': null});
      $orgs['#sg-code-pattern-info-state'].dispatchAction('html', null);
      $orgs['#sg-code-lineage'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineage-fill'].dispatchAction('html', null);
      $orgs['#sg-code-lineager'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineager-fill'].dispatchAction('html', null);
    });

    it('updates code', function () {
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();

      codeViewer.updateMetadata(
        [],
        [],
        'compounds-block',
        '',
        []
      );

      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();

      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);

      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
    });

    /* eslint-disable comma-spacing, key-spacing, max-len, quote-props, quotes */
    it('updates code with lineage array', function () {
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();

      codeViewer.updateMetadata(
        [{"lineagePattern":"elements-paragraph","lineagePath":"patterns/00-elements-paragraph/00-elements-paragraph.html","isHidden":false,"lineageState":"complete"}],
        [],
        'compounds-block',
        '',
        []
      );

      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();

      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.not.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);

      expect(sgCodeLineageAfter.css.display).to.equal('block');
      expect(sgCodeLineageFillAfter.html).to.equal(
        '<a href="patterns/00-elements-paragraph/00-elements-paragraph.html" class="sg-pattern-state complete">elements-paragraph</a>'
      );
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
    });

    it('updates code with lineageR array', function () {
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();

      codeViewer.updateMetadata(
        [],
        [{"lineagePattern":"components-region","lineagePath":"patterns/02-components-region/02-components-region.html","isHidden":false,"lineageState":"inreview"}],
        'compounds-block',
        '',
        []
      );

      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();

      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.not.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);

      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('block');
      expect(sgCodeLineagerFillAfter.html).to.equal(
        '<a href="patterns/02-components-region/02-components-region.html" class="sg-pattern-state inreview">components-region</a>'
      );
    });
    /* eslint-enable comma-spacing, key-spacing, max-len, quote-props, quotes */

    it('updates code with pattern state', function () {
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();

      codeViewer.updateMetadata(
        [],
        [],
        'compounds-block',
        'inprogress',
        []
      );

      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();

      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodePatternInfoBefore.html).to.not.equal(sgCodePatternInfoAfter.html);

      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
      expect(sgCodePatternInfoAfter.html)
        .to.equal('<span class="sg-pattern-state inprogress">inprogress</span>');
    });

    it('shows when a pattern is missing an included partial', function () {
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodeMissingPartialsFillBefore = $orgs['#sg-code-missing-partials-fill'].getState();

      codeViewer.updateMetadata(
        [],
        [],
        'compounds-block',
        '',
        ['organisms-molecules']
      );

      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodeMissingPartialsFillAfter = $orgs['#sg-code-missing-partials-fill'].getState();

      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodeMissingPartialsFillBefore.html).to.not.equal(sgCodeMissingPartialsFillAfter.html);

      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
      expect(sgCodeMissingPartialsFillAfter.html).to.equal('organisms-molecules');
    });

    it('shows when a pattern is missing multiple included partials', function () {
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodeMissingPartialsFillBefore = $orgs['#sg-code-missing-partials-fill'].getState();

      codeViewer.updateMetadata(
        [],
        [],
        'compounds-block',
        '',
        ['organisms-molecules, molecules-atoms']
      );

      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodeMissingPartialsFillAfter = $orgs['#sg-code-missing-partials-fill'].getState();

      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodeMissingPartialsFillBefore.html).to.not.equal(sgCodeMissingPartialsFillAfter.html);

      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
      expect(sgCodeMissingPartialsFillAfter.html).to.equal('organisms-molecules, molecules-atoms');
    });
  });

  describe('.receiveIframeMessage()', function () {
    let event;

    before(function () {
      global.location = {
        protocol: 'http:',
        host: 'localhost:3000'
      };
      event = {
        origin: 'http://localhost:3000'
      };
    });

    it('displays Markdown panel content in a fresh state (although the code viewer might be closed)', function () {
      event.data = {
        lineage: [],
        lineageR: [],
        missingPartials: [],
        patternPartial: 'pages-homepage',
        patternState: '',
        viewall: false
      };

      $orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-pane-markdown-na'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-pane-markdown-edit'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-pane-markdown-load-anim'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-pane-markdown-commit'].dispatchAction('css', {display: ''});

      const paneMarkdownStateBefore = $orgs['#sg-code-pane-markdown'].getState();

      codeViewer.receiveIframeMessage(event);

      const paneMarkdownStateAfter = $orgs['#sg-code-pane-markdown'].getState();

      expect(paneMarkdownStateBefore.css).to.not.have.key('display');

      expect(paneMarkdownStateAfter.css.display).to.equal('block');
    });

    it('updates code when submitting pattern data from viewall', function () {
      codeViewer.closeCode();
      $orgs['#sg-code-container'].dispatchAction('attr', {'data-pattern-partial': ''});
      $orgs['#sg-code-pattern-info-state'].dispatchAction('html', '');
      $orgs['#sg-code-lineage'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineage-fill'].dispatchAction('html', '');
      $orgs['#sg-code-lineager'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineager-fill'].dispatchAction('html', '');

      event.data = {
        lineage: [{
          lineagePattern: 'elements-paragraph',
          lineagePath: 'patterns/00-elements-paragraph/00-elements-paragraph.html',
          isHidden: false
        }],
        lineageR: [{
          lineagePattern: 'components-region',
          lineagePath: 'patterns/02-components-region/02-components-region.html',
          isHidden: false
        }],
        missingPartials: [],
        patternPartial: 'compounds-block',
        patternState: '',
        viewall: true
      };
      const patternlabBodyStateBefore = $orgs['#patternlab-body'].getState();
      const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const patternlabBodyStateAfter = $orgs['#patternlab-body'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();

      expect(patternlabBodyStateBefore.classArray).to.not.include('viewall');
      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.not.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerFillBefore.html).to.not.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);

      expect(patternlabBodyStateAfter.classArray).to.include('viewall');
      expect(sgCodeLineageAfter.css.display).to.equal('block');
      expect(sgCodeLineageFillAfter.html).to.equal(
      // eslint-disable-next-line indent
'<a href="patterns/00-elements-paragraph/00-elements-paragraph.html" class="">elements-paragraph</a>');
      expect(sgCodeLineagerAfter.css.display).to.equal('block');
      expect(sgCodeLineagerFillAfter.html).to.equal(
      // eslint-disable-next-line indent
'<a href="patterns/02-components-region/02-components-region.html" class="">components-region</a>');
      expect(codeViewer.viewall).to.be.true;
    });

    it('removes viewall styling when submitting data from pattern and not viewall', function () {
      codeViewer.closeCode();
      $orgs['#sg-code-container'].dispatchAction('attr', {'data-pattern-partial': ''});
      $orgs['#sg-code-pattern-info-state'].dispatchAction('html', '');
      $orgs['#sg-code-lineage'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineage-fill'].dispatchAction('html', '');
      $orgs['#sg-code-lineager'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineager-fill'].dispatchAction('html', '');

      event.data = {
        lineage: [{
          lineagePattern: 'elements-paragraph',
          lineagePath: 'patterns/00-elements-paragraph/00-elements-paragraph.html',
          isHidden: false
        }],
        lineageR: [{
          lineagePattern: 'components-region',
          lineagePath: 'patterns/02-components-region/02-components-region.html',
          isHidden: false
        }],
        missingPartials: [],
        patternPartial: 'compounds-block',
        patternState: '',
        viewall: false
      };
      const patternlabBodyStateBefore = $orgs['#patternlab-body'].getState();
      const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const patternlabBodyStateAfter = $orgs['#patternlab-body'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();

      expect(patternlabBodyStateBefore.classArray).to.include('viewall');
      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.not.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerFillBefore.html).to.not.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);

      expect(patternlabBodyStateAfter.classArray).to.not.include('viewall');
      expect(sgCodeLineageAfter.css.display).to.equal('block');
      expect(sgCodeLineageFillAfter.html).to.equal(
      // eslint-disable-next-line indent
'<a href="patterns/00-elements-paragraph/00-elements-paragraph.html" class="">elements-paragraph</a>');
      expect(sgCodeLineagerAfter.css.display).to.equal('block');
      expect(sgCodeLineagerFillAfter.html).to.equal(
      // eslint-disable-next-line indent
'<a href="patterns/02-components-region/02-components-region.html" class="">components-region</a>');
      expect(codeViewer.viewall).to.be.false;
    });

    it('opens code on data.codeViewallClick = "on"', function (done) {
      event.data = {
        codeViewallClick: 'on',
        lineage: [],
        lineageR: [],
        patternPartial: 'compounds-block',
        patternState: '',
        viewall: true
      };

      codeViewer.closeCode();

      const codeActiveBefore = codeViewer.codeActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      setTimeout(() => {
        codeViewer.receiveIframeMessage(event);

        setTimeout(() => {
          const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
          const sgTCodeAfter = $orgs['#sg-t-code'].getState();
          const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

          expect(codeActiveBefore).to.be.false;
          expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
          expect(sgTCodeBefore.classArray).to.not.include('active');
          expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

          expect(codeViewer.codeActive).to.be.true;
          expect(patternlabBodyAfter.classArray).to.include('dock-open');
          expect(sgTCodeAfter.classArray).to.include('active');
          expect(sgViewContainerAfter.classArray).to.include('anim-ready');

          done();
        }, timeout);
      }, timeout);
    });

    it('closes code on data.codeViewallClick = "off"', function (done) {
      event.data = {
        codeViewallClick: 'off'
      };

      codeViewer.openCode();

      const codeActiveBefore = codeViewer.codeActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      setTimeout(() => {
        codeViewer.receiveIframeMessage(event);

        setTimeout(() => {
          const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
          const sgTCodeAfter = $orgs['#sg-t-code'].getState();
          const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

          expect(codeActiveBefore).to.be.true;
          expect(patternlabBodyBefore.classArray).to.include('dock-open');
          expect(sgTCodeBefore.classArray).to.include('active');
          expect(sgViewContainerBefore.classArray).to.include('anim-ready');

          expect(codeViewer.codeActive).to.be.false;
          expect(patternlabBodyAfter.classArray).to.not.include('dock-open');
          expect(sgTCodeAfter.classArray).to.not.include('active');
          expect(sgViewContainerAfter.classArray).to.not.include('anim-ready');

          done();
        }, timeout);
      }, timeout);
    });

    it('toggles code on with patternlab.keyPress "ctrl+shift+c"', function (done) {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+c'
      };
      const codeActiveBefore = codeViewer.codeActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.receiveIframeMessage(event);

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTCodeAfter = $orgs['#sg-t-code'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(codeActiveBefore).to.be.false;
        expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
        expect(sgTCodeBefore.classArray).to.not.include('active');
        expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

        expect(codeViewer.codeActive).to.be.true;
        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(sgTCodeAfter.classArray).to.include('active');
        expect(sgViewContainerAfter.classArray).to.include('anim-ready');

        done();
      }, timeout);
    });

    it('switches to the next tab/panel with patternlab.keyPress "ctrl+shift+]"', function () {
      global.mockResponse = {
        gatekeeper_status: 200
      };
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+]'
      };

      const sgCodeTabState0Before = $orgs['.sg-code-tab'].getState(0);
      const sgCodeTabState1Before = $orgs['.sg-code-tab'].getState(1);

      expect(sgCodeTabState0Before.classArray).to.include('sg-code-tab-active');
      expect(sgCodeTabState1Before.classArray).to.not.include('sg-code-tab-active');

      codeViewer.receiveIframeMessage(event);

      const sgCodeTabState0After = $orgs['.sg-code-tab'].getState(0);
      const sgCodeTabState1After = $orgs['.sg-code-tab'].getState(1);

      expect(sgCodeTabState0After.classArray).to.not.include('sg-code-tab-active');
      expect(sgCodeTabState1After.classArray).to.include('sg-code-tab-active');
    });

    it('switches to the next tab/panel with patternlab.keyPress "ctrl+shift+["', function () {
      global.mockResponse = {
        gatekeeper_status: 200
      };
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+['
      };

      const sgCodeTabState0Before = $orgs['.sg-code-tab'].getState(0);
      const sgCodeTabState1Before = $orgs['.sg-code-tab'].getState(1);

      expect(sgCodeTabState0Before.classArray).to.not.include('sg-code-tab-active');
      expect(sgCodeTabState1Before.classArray).to.include('sg-code-tab-active');

      codeViewer.receiveIframeMessage(event);

      const sgCodeTabState0After = $orgs['.sg-code-tab'].getState(0);
      const sgCodeTabState1After = $orgs['.sg-code-tab'].getState(1);

      expect(sgCodeTabState0After.classArray).to.include('sg-code-tab-active');
      expect(sgCodeTabState1After.classArray).to.not.include('sg-code-tab-active');
    });

    it('docks the Code Viewer to the left with patternlab.keyPress "ctrl+alt+h"', function (done) {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+alt+h'
      };
      const dataSaverDockPositionBefore = dataSaver.findValue('dockPosition');
      const dataSaverHalfModeBefore = dataSaver.findValue('halfMode');
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const uiPropsDockPositionBefore = uiProps.dockPosition;
      const uiPropsHalfModeBefore = uiProps.halfMode;

      codeViewer.receiveIframeMessage(event);

      setTimeout(() => {
        const dataSaverDockPositionAfter = dataSaver.findValue('dockPosition');
        const dataSaverHalfModeAfter = dataSaver.findValue('halfMode');
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const uiPropsDockPositionAfter = uiProps.dockPosition;
        const uiPropsHalfModeAfter = uiProps.halfMode;

        expect(dataSaverDockPositionBefore).to.not.equal('left');
        expect(dataSaverHalfModeBefore).to.not.equal('true');
        expect(patternlabBodyBefore.classArray).to.not.include('dock-left');
        expect(uiPropsDockPositionBefore).to.not.equal('left');
        expect(uiPropsHalfModeBefore).to.not.be.true;

        expect(dataSaverDockPositionAfter).to.equal('left');
        expect(dataSaverHalfModeAfter).to.equal('true');
        expect(patternlabBodyAfter.classArray).to.include('dock-left');
        expect(uiPropsDockPositionAfter).to.equal('left');
        expect(uiPropsHalfModeAfter).to.be.true;

        done();
      }, timeout);
    });

    it('docks the Code Viewer to the right with patternlab.keyPress "ctrl+alt+l"', function (done) {
      dataSaver.removeValue('halfMode');

      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+alt+l'
      };
      uiProps.halfMode = false;
      const dataSaverDockPositionBefore = dataSaver.findValue('dockPosition');
      const dataSaverHalfModeBefore = dataSaver.findValue('halfMode');
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const uiPropsDockPositionBefore = uiProps.dockPosition;
      const uiPropsHalfModeBefore = uiProps.halfMode;

      codeViewer.receiveIframeMessage(event);

      setTimeout(() => {
        const dataSaverDockPositionAfter = dataSaver.findValue('dockPosition');
        const dataSaverHalfModeAfter = dataSaver.findValue('halfMode');
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const uiPropsDockPositionAfter = uiProps.dockPosition;
        const uiPropsHalfModeAfter = uiProps.halfMode;

        expect(dataSaverDockPositionBefore).to.not.equal('right');
        expect(dataSaverHalfModeBefore).to.not.equal('true');
        expect(patternlabBodyBefore.classArray).to.not.include('dock-right');
        expect(uiPropsDockPositionBefore).to.not.equal('right');
        expect(uiPropsHalfModeBefore).to.not.be.true;

        expect(dataSaverDockPositionAfter).to.equal('right');
        expect(dataSaverHalfModeAfter).to.equal('true');
        expect(patternlabBodyAfter.classArray).to.include('dock-right');
        expect(uiPropsDockPositionAfter).to.equal('right');
        expect(uiPropsHalfModeAfter).to.be.true;

        done();
      }, timeout);
    });

    it('docks the Code Viewer to the bottom with patternlab.keyPress "ctrl+alt+j"', function (done) {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+alt+j'
      };
      const dataSaverDockPositionBefore = dataSaver.findValue('dockPosition');
      const dataSaverHalfModeBefore = dataSaver.findValue('halfMode');
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const uiPropsDockPositionBefore = uiProps.dockPosition;

      codeViewer.receiveIframeMessage(event);

      setTimeout(() => {
        const dataSaverDockPositionAfter = dataSaver.findValue('dockPosition');
        const dataSaverHalfModeAfter = dataSaver.findValue('halfMode');
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const uiPropsDockPositionAfter = uiProps.dockPosition;
        const uiPropsHalfModeAfter = uiProps.halfMode;

        expect(dataSaverDockPositionBefore).to.not.equal('bottom');
        expect(dataSaverHalfModeBefore).to.not.be.null;
        expect(patternlabBodyBefore.classArray).to.not.include('dock-bottom');
        expect(uiPropsDockPositionBefore).to.not.equal('bottom');
        expect(uiPropsDockPositionBefore).to.not.be.false;

        expect(dataSaverDockPositionAfter).to.equal('bottom');
        expect(dataSaverHalfModeAfter).to.be.null;
        expect(patternlabBodyAfter.classArray).to.include('dock-bottom');
        expect(uiPropsDockPositionAfter).to.equal('bottom');
        expect(uiPropsHalfModeAfter).to.be.false;

        done();
      }, timeout);
    });

    it('toggles code off with patternlab.keyPress "ctrl+shift+c"', function (done) {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+c'
      };
      const codeActiveBefore = codeViewer.codeActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.receiveIframeMessage(event);

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTCodeAfter = $orgs['#sg-t-code'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(codeActiveBefore).to.be.true;
        expect(patternlabBodyBefore.classArray).to.include('dock-open');
        expect(sgTCodeBefore.classArray).to.include('active');
        expect(sgViewContainerBefore.classArray).to.include('anim-ready');

        expect(codeViewer.codeActive).to.be.false;
        expect(patternlabBodyAfter.classArray).to.not.include('dock-open');
        expect(sgTCodeAfter.classArray).to.not.include('active');
        expect(sgViewContainerAfter.classArray).to.not.include('anim-ready');

        done();
      }, timeout);
    });

    it('closes codeViewer with patternlab.keyPress "esc"', function (done) {
      codeViewer.openCode();

      setTimeout(() => {
        event.data = {
          event: 'patternlab.keyPress',
          keyPress: 'esc'
        };
        const codeActiveBefore = codeViewer.codeActive;
        const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
        const sgTCodeBefore = $orgs['#sg-t-code'].getState();
        const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

        codeViewer.receiveIframeMessage(event);

        setTimeout(() => {
          const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
          const sgTCodeAfter = $orgs['#sg-t-code'].getState();
          const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

          expect(codeActiveBefore).to.be.true;
          expect(patternlabBodyBefore.classArray).to.include('dock-open');
          expect(sgTCodeBefore.classArray).to.include('active');
          expect(sgViewContainerBefore.classArray).to.include('anim-ready');

          expect(codeViewer.codeActive).to.be.false;
          expect(patternlabBodyAfter.classArray).to.not.include('dock-open');
          expect(sgTCodeAfter.classArray).to.not.include('active');
          expect(sgViewContainerAfter.classArray).to.not.include('anim-ready');

          done();
        }, timeout);
      }, timeout);
    });

    it('sets Markdown panel content with patternlab.pageLoad, but with error', function (done) {
      event.data = {
        event: 'patternlab.pageLoad'
      };

      $orgs['#sg-code-pane-markdown-load-anim'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-console-markdown-error'].dispatchAction('html', 'fatal error');
      $orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: ''});

      const paneMarkdownLoadAnimStateBefore = $orgs['#sg-code-pane-markdown-load-anim'].getState();
      const paneMarkdownStateBefore = $orgs['#sg-code-pane-markdown'].getState();

      codeViewer.receiveIframeMessage(event);

      setTimeout(() => {
        const paneMarkdownLoadAnimStateAfter = $orgs['#sg-code-pane-markdown-load-anim'].getState();
        const paneMarkdownStateAfter = $orgs['#sg-code-pane-markdown'].getState();

        expect(paneMarkdownLoadAnimStateBefore.css.display).to.equal('block');
        expect(paneMarkdownStateBefore.css).to.not.have.key('display');

        expect(paneMarkdownLoadAnimStateAfter.css).to.not.have.key('display');
        expect(paneMarkdownStateAfter.css).to.not.have.key('display');

        done();
      }, 500 + timeout);
    });

    it('sets Markdown panel content with patternlab.pageLoad, and no error', function (done) {
      event.data = {
        event: 'patternlab.pageLoad'
      };

      $orgs['#sg-code-pane-markdown-load-anim'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-console-markdown-error'].dispatchAction('html', '');
      $orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: ''});

      const paneMarkdownLoadAnimStateBefore = $orgs['#sg-code-pane-markdown-load-anim'].getState();
      const paneMarkdownStateBefore = $orgs['#sg-code-pane-markdown'].getState();

      codeViewer.receiveIframeMessage(event);

      setTimeout(() => {
        const paneMarkdownLoadAnimStateAfter = $orgs['#sg-code-pane-markdown-load-anim'].getState();
        const paneMarkdownStateAfter = $orgs['#sg-code-pane-markdown'].getState();

        expect(paneMarkdownLoadAnimStateBefore.css.display).to.equal('block');
        expect(paneMarkdownStateBefore.css).to.not.have.key('display');

        expect(paneMarkdownLoadAnimStateAfter.css).to.not.have.key('display');
        expect(paneMarkdownStateAfter.css.display).to.equal('block');

        done();
      }, 500 + timeout);
    });

    it('clears old log errors in the Markdown panel content upon patternlab.pageLoad', function (done) {
      event.data = {
        event: 'patternlab.pageLoad'
      };

      $orgs['#sg-code-pane-markdown-load-anim'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-pane-markdown-console'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-console-markdown-log'].dispatchAction('html', 'Error');
      $orgs['#sg-code-console-markdown-error'].dispatchAction('empty');
      $orgs['#sg-code-btn-markdown-continue'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-tab-git'].dispatchAction('addClass', 'sg-code-tab-warning');
      $orgs['#sg-code-message-git-na'].dispatchAction('html', 'Error');

      const paneMarkdownLoadAnimStateBefore = $orgs['#sg-code-pane-markdown-load-anim'].getState();
      const btnMarkdownEditStateBefore = $orgs['#sg-code-btn-markdown-edit'].getState();
      const paneMarkdownConsoleStateBefore = $orgs['#sg-code-pane-markdown-console'].getState();
      const consoleMarkdownLogStateBefore = $orgs['#sg-code-console-markdown-log'].getState();
      const consoleMarkdownErrorStateBefore = $orgs['#sg-code-console-markdown-error'].getState();
      const btnMarkdownContinueStateBefore = $orgs['#sg-code-btn-markdown-continue'].getState();
      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const messageGitNaStateBefore = $orgs['#sg-code-message-git-na'].getState();

      codeViewer.receiveIframeMessage(event);

      setTimeout(() => {
        const paneMarkdownLoadAnimStateAfter = $orgs['#sg-code-pane-markdown-load-anim'].getState();
        const btnMarkdownEditStateAfter = $orgs['#sg-code-btn-markdown-edit'].getState();
        const paneMarkdownConsoleStateAfter = $orgs['#sg-code-pane-markdown-console'].getState();
        const consoleMarkdownLogStateAfter = $orgs['#sg-code-console-markdown-log'].getState();
        const consoleMarkdownErrorStateAfter = $orgs['#sg-code-console-markdown-error'].getState();
        const btnMarkdownContinueStateAfter = $orgs['#sg-code-btn-markdown-continue'].getState();
        const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
        const messageGitNaStateAfter = $orgs['#sg-code-message-git-na'].getState();

        expect(paneMarkdownLoadAnimStateBefore.css).to.not.have.key('display');
        expect(btnMarkdownEditStateBefore.css.display).to.equal('block');
        expect(paneMarkdownConsoleStateBefore.css.display).to.equal('block');
        expect(consoleMarkdownLogStateBefore.html).to.not.be.empty;
        expect(consoleMarkdownErrorStateBefore.html).to.be.empty;
        expect(btnMarkdownContinueStateBefore.css.display).to.equal('block');
        expect(tabGitStateBefore.classArray).to.include('sg-code-tab-warning');
        expect(messageGitNaStateBefore.html).to.not.be.empty;

        expect(paneMarkdownLoadAnimStateAfter.css).to.not.have.key('display');
        expect(btnMarkdownEditStateAfter.css).to.not.have.key('display');
        expect(paneMarkdownConsoleStateAfter.css).to.not.have.key('display');
        expect(consoleMarkdownLogStateAfter.html).to.be.empty;
        expect(consoleMarkdownErrorStateAfter.html).to.be.empty;
        expect(btnMarkdownContinueStateAfter.css).to.not.have.key('display');
        expect(tabGitStateAfter.classArray).to.not.include('sg-code-tab-warning');
        expect(messageGitNaStateAfter.html).to.be.empty;

        done();
      }, 500 + timeout);
    });

    it('clears old console errors in the Markdown panel content upon patternlab.pageLoad', function (done) {
      event.data = {
        event: 'patternlab.pageLoad'
      };

      $orgs['#sg-code-pane-markdown-load-anim'].dispatchAction('css', {display: ''});
      $orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-pane-markdown-console'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-console-markdown-log'].dispatchAction('empty');
      $orgs['#sg-code-console-markdown-error'].dispatchAction('html', 'Error');
      $orgs['#sg-code-btn-markdown-continue'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-tab-git'].dispatchAction('addClass', 'sg-code-tab-warning');
      $orgs['#sg-code-message-git-na'].dispatchAction('html', 'Error');

      const paneMarkdownLoadAnimStateBefore = $orgs['#sg-code-pane-markdown-load-anim'].getState();
      const btnMarkdownEditStateBefore = $orgs['#sg-code-btn-markdown-edit'].getState();
      const paneMarkdownConsoleStateBefore = $orgs['#sg-code-pane-markdown-console'].getState();
      const consoleMarkdownLogStateBefore = $orgs['#sg-code-console-markdown-log'].getState();
      const consoleMarkdownErrorStateBefore = $orgs['#sg-code-console-markdown-error'].getState();
      const btnMarkdownContinueStateBefore = $orgs['#sg-code-btn-markdown-continue'].getState();
      const tabGitStateBefore = $orgs['#sg-code-tab-git'].getState();
      const messageGitNaStateBefore = $orgs['#sg-code-message-git-na'].getState();

      codeViewer.receiveIframeMessage(event);

      setTimeout(() => {
        const paneMarkdownLoadAnimStateAfter = $orgs['#sg-code-pane-markdown-load-anim'].getState();
        const btnMarkdownEditStateAfter = $orgs['#sg-code-btn-markdown-edit'].getState();
        const paneMarkdownConsoleStateAfter = $orgs['#sg-code-pane-markdown-console'].getState();
        const consoleMarkdownLogStateAfter = $orgs['#sg-code-console-markdown-log'].getState();
        const consoleMarkdownErrorStateAfter = $orgs['#sg-code-console-markdown-error'].getState();
        const btnMarkdownContinueStateAfter = $orgs['#sg-code-btn-markdown-continue'].getState();
        const tabGitStateAfter = $orgs['#sg-code-tab-git'].getState();
        const messageGitNaStateAfter = $orgs['#sg-code-message-git-na'].getState();

        expect(paneMarkdownLoadAnimStateBefore.css).to.not.have.key('display');
        expect(btnMarkdownEditStateBefore.css.display).to.equal('block');
        expect(paneMarkdownConsoleStateBefore.css.display).to.equal('block');
        expect(consoleMarkdownLogStateBefore.html).to.be.empty;
        expect(consoleMarkdownErrorStateBefore.html).to.not.be.empty;
        expect(btnMarkdownContinueStateBefore.css.display).to.equal('block');
        expect(tabGitStateBefore.classArray).to.include('sg-code-tab-warning');
        expect(messageGitNaStateBefore.html).to.not.be.empty;

        expect(paneMarkdownLoadAnimStateAfter.css).to.not.have.key('display');
        expect(btnMarkdownEditStateAfter.css).to.not.have.key('display');
        expect(paneMarkdownConsoleStateAfter.css).to.not.have.key('display');
        expect(consoleMarkdownLogStateAfter.html).to.be.empty;
        expect(consoleMarkdownErrorStateAfter.html).to.be.empty;
        expect(btnMarkdownContinueStateAfter.css).to.not.have.key('display');
        expect(tabGitStateAfter.classArray).to.not.include('sg-code-tab-warning');
        expect(messageGitNaStateAfter.html).to.be.empty;

        done();
      }, 500 + timeout);
    });

    it('sets panel content with patternlab.updatePath', function (done) {
      const expectedMarkdown =
`---
content_key: content
---
[Component](../../patterns/02-components-region/02-components-region.html)
`;
      global.mockResponse = {
        gatekeeper_status: 200
      };

      $orgs['#sg-code-pane-markdown-na'].dispatchAction('css', {display: 'block'});
      $orgs['#sg-code-code-language-markdown'].dispatchAction('html', '');
      $orgs['#sg-code-textarea-markdown'].dispatchAction('html', '');
      codeViewer.openCode();

      setTimeout(() => {
        event.data = {
          event: 'patternlab.updatePath',
          path: 'patterns/04-pages-00-homepage/04-pages-00-homepage.html',
          patternPartial: 'pages-homepage'
        };
        const fepletLocationHrefBefore = $orgs['#sg-code-panel-feplet'][0].contentWindow.location.href;
        const paneMarkdownNaStateBefore = $orgs['#sg-code-pane-markdown-na'].getState();
        const codeMarkdownStateBefore = $orgs['#sg-code-code-language-markdown'].getState();

        codeViewer.receiveIframeMessage(event);

        setTimeout(() => {
          const fepletLocationHrefAfter = $orgs['#sg-code-panel-feplet'][0].contentWindow.location.href;
          const paneMarkdownNaStateAfter = $orgs['#sg-code-pane-markdown-na'].getState();
          const codeMarkdownStateAfter = $orgs['#sg-code-code-language-markdown'].getState();

          expect(fepletLocationHrefBefore).to.not.equal(fepletLocationHrefAfter);
          expect(paneMarkdownNaStateBefore.css.display).to.not.equal(paneMarkdownNaStateAfter.css.display);
          expect(codeMarkdownStateBefore.html).to.not.equal(codeMarkdownStateAfter.html);

          expect(fepletLocationHrefAfter).to.equal('/mustache-browser?partial=pages-homepage');
          expect(paneMarkdownNaStateAfter.css.display).to.be.undefined;
          expect(codeMarkdownStateAfter.html).to.equal(expectedMarkdown);

          codeViewer.closeCode();
          done();
        }, timeout);
      }, timeout);
    });
  });
});
