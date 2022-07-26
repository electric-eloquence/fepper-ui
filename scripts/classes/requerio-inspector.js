export default class RequerioInspector {
  constructor(fepperUi) {
    this.htmlOrig = null;
    this.$orgs = fepperUi.requerio.$orgs; // Organisms in the UI.
  }

  stoke() {
    this.$orgs['#sg-viewport'].on('load', () => {
      const requerioP = this.$orgs['#sg-viewport'][0].contentWindow.requerio;

      /* istanbul ignore if */
      if (!requerioP) {
        return;
      }

      this.$orgs['#sg-code-pane-requerio'].dispatchAction('html');

      const state = requerioP.store.getState();
      const htmlOrig = this.$orgs['#sg-code-pane-requerio'].getState().html;
      // eslint-disable-next-line eqeqeq
      this.htmlOrig = htmlOrig == null ? '' : htmlOrig;
      this.htmlOrig = this.htmlOrig.replace(/\s*<ul id="sg-code-tree-requerio-trunk"[\S\s]*/, '');

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

      const htmlToAppend = this.buildHtml(state);

      // Not using the 'append' action because the Requerio Inspector gets stoked multiple times by LiveReload.
      this.$orgs['#sg-code-pane-requerio'].dispatchAction('html', this.htmlOrig + htmlToAppend);

      this.$orgs['#sg-code-pane-requerio'].dispatchAction('css', {display: 'block'});
    });
  }

  buildClickableHtmlAndTextContent(key, value) {
    let htmlString = `<span class="clickable sg-code-tree-requerio-key">${key}:</span> `;
    htmlString += '<ul class="sg-code-tree-requerio sg-code-tree-requerio-branch sg-code-tree-requerio-value">';
    htmlString += '<li class="sg-code-tree-requerio sg-code-tree-requerio-node sg-code-tree-requerio-leaf">';
    htmlString += `<span class="sg-code-tree-requerio-value">${window.he.encode(value)}</span>`;
    htmlString += '</li></ul>';

    return htmlString;
  }

  buildHtml(state) {
    let htmlString = '<ul id="sg-code-tree-requerio-trunk" class="sg-code-tree-requerio">';
    htmlString += this.buildTree(state);
    htmlString += '</ul>';

    return htmlString;
  }

  buildTree(branch) {
    let htmlString = '';

    for (const key of Object.keys(branch)) {
      htmlString += '<li class="sg-code-tree-requerio sg-code-tree-requerio-node';

      // Cannot use instanceof Object on state properties.
      if (branch[key] && typeof branch[key] === 'object') {
        if (Object.keys(branch[key]).length) {
          htmlString += ' sg-code-tree-requerio-branch">';
          htmlString += `<span class="clickable sg-code-tree-requerio-key">${key}:</span> `;
          htmlString += '<ul class="sg-code-tree-requerio sg-code-tree-requerio-branch sg-code-tree-requerio-value">';
          htmlString += this.buildTree(branch[key]);
          htmlString += '</ul>';
        }
        else {
          if (Array.isArray(branch[key])) {
            htmlString += ` sg-code-tree-requerio-leaf"><span class="sg-code-tree-requerio-key">${key}:</span> ` +
              '<span class="sg-code-tree-requerio-value">[]</span>';
          }
          else {
            htmlString += ` sg-code-tree-requerio-leaf"><span class="sg-code-tree-requerio-key">${key}:</span> ` +
              '<span class="sg-code-tree-requerio-value">{}</span>';
          }
        }
      }
      else if (typeof branch[key] === 'string') {
        switch (key) {
          case 'html':
          case 'textContent':
            htmlString += ' sg-code-tree-requerio-branch">';
            htmlString += this.buildClickableHtmlAndTextContent(key, branch[key]);

            break;
          default:
            htmlString += ` sg-code-tree-requerio-leaf"><span class="sg-code-tree-requerio-key">${key}:</span> ` +
              `<span class="sg-code-tree-requerio-value">"${window.he.encode(branch[key])}"</span>`;
        }
      }
      else {
        htmlString += ` sg-code-tree-requerio-leaf"><span class="sg-code-tree-requerio-key">${key}:</span> ` +
          `<span class="sg-code-tree-requerio-value">${branch[key]}</span>`;
      }

      htmlString += '</li>';
    }

    return htmlString;
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
        if (typeof nowValue === 'string') {
          switch (nowKey) {
            case 'html':
            case 'textContent':
              domChildren[i].innerHTML = this.buildClickableHtmlAndTextContent(nowKey, nowValue);

              domChildren[i].classList.remove('sg-code-tree-requerio-leaf');
              domChildren[i].classList.add('sg-code-tree-requerio-branch');
              /* istanbul ignore next */
              domChildren[i].children[0].addEventListener('click', () => {
                this.toggleExpandableBranch(domChildren[i]);
              });

              break;
            default: {
              // Declaring const and wrapping in braces because putting the regex in backticks breaks vim highlighting.
              const nowValueEscaped = nowValue.replace(/"/g, '\\"');
              domChildren[i].innerHTML = `<span class="sg-code-tree-requerio-key">${nowKey}:</span> ` +
                `<span class="sg-code-tree-requerio-value">"${window.he.encode(nowValueEscaped)}"</span>`;

              domChildren[i].classList.remove('sg-code-tree-requerio-branch');
              domChildren[i].classList.add('sg-code-tree-requerio-leaf');
            }
          }
        }
        else {
          domChildren[i].innerHTML = `<span class="sg-code-tree-requerio-key">${nowKey}:</span> ` +
            `<span class="sg-code-tree-requerio-value">${nowValue}</span>`;

          domChildren[i].classList.remove('sg-code-tree-requerio-branch');
          domChildren[i].classList.add('sg-code-tree-requerio-leaf');
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
            if (Array.isArray(nowValue)) {
              domChildren[i].innerHTML = `<span class="sg-code-tree-requerio-key">${nowKey}:</span> ` +
               '<span class="sg-code-tree-requerio-value">[]</span>';
            }
            else {
              domChildren[i].innerHTML = `<span class="sg-code-tree-requerio-key">${nowKey}:</span> ` +
               '<span class="sg-code-tree-requerio-value">{}</span>';
            }

            domChildren[i].classList.remove('sg-code-tree-requerio-branch');
            domChildren[i].classList.add('sg-code-tree-requerio-leaf');
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
