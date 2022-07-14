export default class RequerioInspector {
  constructor(fepperUi) {
    this.htmlOrig = null;
    this.$orgs = fepperUi.requerio.$orgs; // Organisms in the UI.
    this.$orgsP = null; // Organisms in the pattern.
    this.requerioP = null;
  }

  stoke() {
    this.$orgs['#sg-viewport'].on('load', () => {
      this.requerioP = this.$orgs['#sg-viewport'][0].contentWindow.requerio;

      /* istanbul ignore if */
      if (!this.requerioP) {
        return;
      }

      this.$orgs['#sg-code-pane-requerio'].dispatchAction('html');

      this.$orgsP = this.requerioP.$orgs;
      const state = this.requerioP.store.getState();
      const htmlOrig = this.$orgs['#sg-code-pane-requerio'].getState().html;
      // eslint-disable-next-line eqeqeq
      this.htmlOrig = htmlOrig == null ? '' : htmlOrig;

      this.$orgs['#sg-code-pane-requerio-na'].dispatchAction('css', {display: 'none'});

      // A Requerio state should never EVER have circular references. But here's a failsafe so Fepper doesn't run an
      // infinite loop in the unimaginable event that the state does.

      // eslint-disable-next-line no-useless-catch
      try {
        JSON.stringify(state);
      }
      catch (err) /* istanbul ignore next */ {
        throw err;
      }

      const html = this.buildHtml(state);

      // Not using the 'append' action because the Requerio Inspector gets stoked multiple times by LiveReload.
      if (!this.htmlOrig || !this.htmlOrig.includes(html)) {
        this.$orgs['#sg-code-pane-requerio'].dispatchAction('html', this.htmlOrig + html);
      }

      this.$orgs['#sg-code-pane-requerio'].dispatchAction('css', {display: 'block'});
    });
  }

  buildHtml(state) {
    let html = '<ul id="sg-code-tree-requerio-trunk" class="sg-code-tree-requerio">';
    html += this.buildTree(state);
    html += '</ul>';

    return html;
  }

  buildTree(branch) {
    let html = '';

    for (const key of Object.keys(branch)) {
      html += '<li class="sg-code-tree-requerio sg-code-tree-requerio-node';

      // Cannot use instanceof Object on state properties.
      if (branch[key] && typeof branch[key] === 'object') {
        if (Object.keys(branch[key]).length) {
          html += ` sg-code-tree-requerio-branch"><span class="clickable sg-code-tree-requerio-key">${key}:</span> `;
          html += '<ul class="sg-code-tree-requerio sg-code-tree-requerio-branch sg-code-tree-requerio-value">';
          html += this.buildTree(branch[key]);
          html += '</ul>';
        }
        else {
          if (Array.isArray(branch[key])) {
            html += ` sg-code-tree-requerio-leaf"><span class="sg-code-tree-requerio-key">${key}:</span> ` +
              '<span class="sg-code-tree-requerio-value">[]</span>';
          }
          else {
            html += ` sg-code-tree-requerio-leaf"><span class="sg-code-tree-requerio-key">${key}:</span> ` +
              '<span class="sg-code-tree-requerio-value">{}</span>';
          }
        }
      }
      else if (typeof branch[key] === 'string') {
        html += ` sg-code-tree-requerio-leaf"><span class="sg-code-tree-requerio-key">${key}:</span> ` +
          `<span class="sg-code-tree-requerio-value">"${window.he.encode(branch[key])}"</span>`;
      }
      else {
        html += ` sg-code-tree-requerio-leaf"><span class="sg-code-tree-requerio-key">${key}:</span> ` +
          `<span class="sg-code-tree-requerio-value">${branch[key]}</span>`;
      }

      html += '</li>';
    }

    return html;
  }

  recurseStatesAndDom(stateBranchBefore, stateBranchNow, domChildren, level) {
    const stateBranchBeforeKeys = Object.keys(stateBranchBefore);
    const stateBranchNowKeys = Object.keys(stateBranchNow);

    for (let i = 0, l = stateBranchNowKeys.length; i < l; i++) {
      const beforeKey = stateBranchBeforeKeys[i];
      const beforeValue = stateBranchBefore[beforeKey];
      const nowKey = stateBranchNowKeys[i];
      const nowValue = stateBranchNow[nowKey];

      if (!domChildren[i]) {
        continue;
      }

      if (!nowValue || typeof nowValue === 'string' || typeof nowValue === 'number') {
        // Always rewrite the DOM for non-objects and non-arrays.
        domChildren[i].classList.remove('sg-code-tree-requerio-branch');
        domChildren[i].classList.add('sg-code-tree-requerio-leaf');

        if (typeof nowValue === 'string') {
          domChildren[i].innerHTML = `<span class="sg-code-tree-requerio-key">${nowKey}:</span> ` +
            `<span class="sg-code-tree-requerio-value">"${window.he.encode(nowValue)}"</span>`;

        }
        else {
          domChildren[i].innerHTML = `<span class="sg-code-tree-requerio-key">${nowKey}:</span> ` +
            `<span class="sg-code-tree-requerio-value">${nowValue}</span>`;
        }
      }
      // Cannot use instanceof Object on state properties.
      else if (typeof nowValue === 'object') {
        if (beforeValue !== nowValue) {
          const nowValueLength = Object.keys(nowValue).length;

          if (nowValueLength) {
            const stateBranchBeforeBranch = beforeValue && typeof beforeValue === 'object' ? beforeValue : {};
            const stateBranchBeforeBranchLength = Object.keys(stateBranchBeforeBranch).length;
            const stateBranchNowBranch = nowValue;

            // Rewrite the DOM if no nested unordered list or if the number of children has changed.
            if (
              !domChildren[i].children[1] ||
              !domChildren[i].children[1].children.length ||
              stateBranchBeforeBranchLength !== nowValueLength
            ) {
              let htmlString = `<span class="clickable sg-code-tree-requerio-key">${nowKey}:</span> ` +
                '<ul class="sg-code-tree-requerio sg-code-tree-requerio-branch sg-code-tree-requerio-value">';

              for (let j = 0; j < Object.keys(stateBranchNowBranch).length; j++) {
                htmlString += '<li class="sg-code-tree-requerio sg-code-tree-requerio-node"></li>';
              }

              htmlString += '</ul>';
              domChildren[i].innerHTML = htmlString;

              /* istanbul ignore next */
              domChildren[i].children[0].addEventListener('click', () => {
                this.toggleExpandableBranch(domChildren[i]);
              });
            }

            domChildren[i].classList.remove('sg-code-tree-requerio-leaf');
            domChildren[i].classList.add('sg-code-tree-requerio-branch');

            const domChildChildren = domChildren[i].children[1].children;
            const levelNext = level ? level + 1 : 1; // For debugging.

            this.recurseStatesAndDom(stateBranchBeforeBranch, stateBranchNowBranch, domChildChildren, levelNext);
          }
          // Rewrite the DOM for empty objects and arrays.
          else {
            domChildren[i].classList.remove('sg-code-tree-requerio-branch');
            domChildren[i].classList.add('sg-code-tree-requerio-leaf');

            if (Array.isArray(nowValue)) {
              domChildren[i].innerHTML = `<span class="sg-code-tree-requerio-key">${nowKey}:</span> ` +
               '<span class="sg-code-tree-requerio-value">[]</span>';
            }
            else {
              domChildren[i].innerHTML = `<span class="sg-code-tree-requerio-key">${nowKey}:</span> ` +
               '<span class="sg-code-tree-requerio-value">{}</span>';
            }
          }
        }
      }
    }
  }

  toggleExpandableBranch(domChild) {
    const $org = this.$orgs['li.sg-code-tree-requerio-branch'];

    $org.populateMembers();

    for (let i = 0, l = $org.length; i < l; i++) {
      if ($org[i] === domChild) {
        $org.dispatchAction('toggleClass', 'expanded', i);

        break;
      }
    }
  }
}
