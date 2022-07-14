/**
 * This unit test uses a different instance of Requerio with a different set of $organisms.
 * Putting this in first place alphanumerically to separate it from the others.
 */
import fs from 'fs';
import path from 'path';

import {expect} from 'chai';

/* eslint-disable max-len */
const stateHtmlSubString =
`<span class="sg-code-tree-requerio-value">{}</span></li><li class="sg-code-tree-requerio sg-code-tree-requerio-node sg-code-tree-requerio-branch"><span class="clickable sg-code-tree-requerio-key">data:</span>
<ul class="sg-code-tree-requerio sg-code-tree-requerio-branch sg-code-tree-requerio-value"><li class="sg-code-tree-requerio sg-code-tree-requerio-node sg-code-tree-requerio-leaf"><span class="sg-code-tree-requerio-key">test:</span>
<span class="sg-code-tree-requerio-value">"pass"</span></li></ul></li><li class="sg-code-tree-requerio sg-code-tree-requerio-node sg-code-tree-requerio-leaf"><span class="sg-code-tree-requerio-key">html:</span>`;
  /* eslint-enable max-len */

const $organisms = {
  '#sg-code-pane-requerio': null,
  '#sg-code-pane-requerio-na': null,
  '#sg-nav-message-test': null,
  '#sg-viewport': null
};

const fepperUi = require('../unit')($organisms);
const $orgs = fepperUi.requerio.$orgs;
const requerio = fepperUi.requerio;
const requerioInspector = fepperUi.requerioInspector;
const requerioInspectorOut = fs.readFileSync(
  path.resolve(__dirname, '..', 'fixtures', 'requerio-inspector.out'), 'utf8');

const requerioP = require('../mocks/requerioP')(requerio, $orgs);

describe('Requerio Inspector', function () {
  after(function () {
    require('../require-cache-bust')();
  });

  describe('.stoke()', function () {
    it('builds the HTML of the state tree of the pattern\'s Requerio organisms', function () {
      const sgCodePaneRequerioStateBefore = $orgs['#sg-code-pane-requerio'].getState();

      requerioInspector.stoke();
      requerio.incept('#sg-code-tree-requerio-trunk', 'li.sg-code-tree-requerio-branch');

      const sgCodePaneRequerioStateAfter = $orgs['#sg-code-pane-requerio'].getState();
      const sgCodePaneRequerioStateAfterHtml = sgCodePaneRequerioStateAfter.html.replace(/> </g, '>\n<');

      expect(sgCodePaneRequerioStateBefore.html).to.be.null;
      expect(sgCodePaneRequerioStateBefore.html).to.not.equal(sgCodePaneRequerioStateAfter.html);
      expect(sgCodePaneRequerioStateAfterHtml).to.equal(requerioInspectorOut);
      expect(sgCodePaneRequerioStateAfterHtml).to.not.have.string(stateHtmlSubString);
    });
  });

  describe('.recurseStatesAndDom()', function () {
    it('rebuilds the HTML of the state tree of the pattern\'s Requerio organisms', function () {
      const patternStoreStateBefore = requerioP.store.getState();
      const sgCodePaneRequerioStateBefore = $orgs['#sg-code-pane-requerio'].getState();
      const sgCodePaneRequerioStateBeforeHtml = sgCodePaneRequerioStateBefore.html.replace(/> </g, '>\n<');

      $orgs['#sg-nav-message-test'].dispatchAction('data', {test: 'pass'}, 0);

      const patternStoreStateNow = requerio.store.getState();

      requerioInspector.recurseStatesAndDom(
        patternStoreStateBefore,
        patternStoreStateNow,
        $orgs['#sg-code-tree-requerio-trunk'][0].children
      );

      const sgCodePaneRequerioStateAfter = $orgs['#sg-code-pane-requerio'].getState();
      const sgCodePaneRequerioStateAfterHtml = sgCodePaneRequerioStateAfter.html.replace(/> </g, '>\n<');

      expect(sgCodePaneRequerioStateBeforeHtml).to.not.have.string(stateHtmlSubString);
      expect(sgCodePaneRequerioStateAfterHtml).to.have.string(stateHtmlSubString);
    });
  });

  describe('.toggleExpandableBranch()', function () {
    let $branches;
    let randomIdx;
    let randomDomElement;

    before(function () {
      $branches = $orgs['li.sg-code-tree-requerio-branch'];
      randomIdx = Math.floor(Math.random() * $branches.length);
      randomDomElement = $branches[randomIdx];
    });

    it('adds the "expanded" class to the HTML for the toggling branch of the state tree', function () {
      const randomDomElementOuterHTMLBefore = randomDomElement.outerHTML;

      requerioInspector.toggleExpandableBranch(randomDomElement);

      const randomDomElementOuterHTMLAfter = randomDomElement.outerHTML;

      expect(randomDomElementOuterHTMLBefore).to.not.have.string('expanded');
      expect(randomDomElementOuterHTMLAfter).to.have.string('expanded');

      for (let i = 0; i < $branches.length; i++) {
        if (i === randomIdx) {
          const firstTag = $branches[i].outerHTML.replace(/>[\S\s]*/, '>');

          expect(firstTag).to.have.string('expanded');
        }
        else {
          const firstTag = $branches[i].outerHTML.replace(/>[\S\s]*/, '>');

          expect(firstTag).to.not.have.string('expanded');
        }
      }
    });

    it('removes the "expanded" class to the HTML for the toggling branch of the state tree', function () {
      const randomDomElementOuterHTMLBefore = randomDomElement.outerHTML;

      requerioInspector.toggleExpandableBranch(randomDomElement);

      const randomDomElementOuterHTMLAfter = randomDomElement.outerHTML;

      expect(randomDomElementOuterHTMLBefore).to.have.string('expanded');
      expect(randomDomElementOuterHTMLAfter).to.not.have.string('expanded');

      for (let i = 0; i < $branches.length; i++) {
        const firstTag = $branches[i].outerHTML.replace(/>[\S\s]*/, '>');

        expect(firstTag).to.not.have.string('expanded');
      }
    });
  });
});
