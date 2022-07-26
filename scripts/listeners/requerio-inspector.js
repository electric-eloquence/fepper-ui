export default class RequerioInspector {
  constructor(fepperUi) {
    this.codeViewer = fepperUi.codeViewer;
    this.$orgs = fepperUi.requerio.$orgs;
    this.requerio = fepperUi.requerio;
    this.requerioInspector = fepperUi.requerioInspector;
    this.stoked = false;
  }

  listen() {
    const $orgs = this.$orgs;

    $orgs['#sg-viewport'].on('load', () => {
      const classesNew = [];
      const requerioInspector = this.requerioInspector;
      const requerioP = this.$orgs['#sg-viewport'][0].contentWindow.requerio;
      const selectorsOrig = [];
      const selectorsNew = [];

      if (!$orgs['#sg-code-tree-requerio-trunk']) {
        this.requerio.incept('#sg-code-tree-requerio-trunk');
      }
      else if (!$orgs['#sg-code-tree-requerio-trunk'].length) {
        $orgs['#sg-code-tree-requerio-trunk'].populateMembers();
      }

      if (!$orgs['#sg-code-tree-requerio-trunk>li']) {
        this.requerio.incept('#sg-code-tree-requerio-trunk>li');
      }
      else if (!$orgs['#sg-code-tree-requerio-trunk>li'].length) {
        $orgs['#sg-code-tree-requerio-trunk>li'].populateMembers();
      }

      if (!$orgs['li.sg-code-tree-requerio-branch']) {
        this.requerio.incept('li.sg-code-tree-requerio-branch');
      }
      else if (!$orgs['li.sg-code-tree-requerio-branch'].length) {
        $orgs['li.sg-code-tree-requerio-branch'].populateMembers();
      }

      if (!$orgs['li.sg-code-tree-requerio-branch>.clickable']) {
        this.requerio.incept('li.sg-code-tree-requerio-branch>.clickable');
      }
      else if (!$orgs['li.sg-code-tree-requerio-branch>.clickable'].length) {
        $orgs['li.sg-code-tree-requerio-branch>.clickable'].populateMembers();
      }

      const $listItemsTrunk = $orgs['#sg-code-tree-requerio-trunk>li'];

      if (
        !requerioP ||
        !requerioP.$orgs ||
        !$orgs['#sg-code-tree-requerio-trunk>li'] ||
        !$orgs['#sg-code-tree-requerio-trunk>li'].length
      ) {
        this.hideRequerioShowNa();

        return;
      }

      // Be sure not to incept organisms with names beginning with .sg-code-tree-requerio- elsewhere.
      // They will get deleted by this loop.
      for (const key of Object.keys($orgs)) {
        if (key.startsWith('.sg-code-tree-requerio-')) {
          delete $orgs[key];
        }
      }

      for (let i = 0, l = $listItemsTrunk.length; i < l; i++) {
        $orgs['#sg-code-tree-requerio-trunk>li'].dispatchAction('text', null, i);

        const liState = $orgs['#sg-code-tree-requerio-trunk>li'].getState(i);

        if (!liState.textContent) {
          continue;
        }

        const selector = liState.textContent.split(':')[0];

        let classNew = 'sg-code-tree-requerio-' +
          selector.replace(/-/g, '_U_002D_').replace(/\W/g, '').replace(/_U_002D_/g, '-');
        let selectorNew = '.' + classNew;

        while (Object.keys($orgs).includes(selectorNew)) {
          classNew += '_';
          selectorNew += '_';
        }

        classesNew.push(classNew);
        selectorsOrig.push(selector);
        selectorsNew.push(selectorNew);
        $orgs['#sg-code-tree-requerio-trunk>li'].dispatchAction('addClass', classNew, i);
        this.requerio.incept(selectorNew);
      }

      // Using additional logic in case elements already have a contrast filter.
      for (let i = 0, l = selectorsOrig.length; i < l; i++) {
        const selectorOrig = selectorsOrig[i];

        if (!requerioP || !requerioP.$orgs || !requerioP.$orgs[selectorOrig]) {
          continue;
        }

        const patternOrgState = requerioP.$orgs[selectorOrig].getState();

        for (let j = 0; j < patternOrgState.members; j++) {
          const computedStyle = window.getComputedStyle(requerioP.$orgs[selectorOrig][j]);

          if (computedStyle.filter.includes('contrast')) {
            const filterOrig = computedStyle.filter;

            requerioP.$orgs[selectorOrig].dispatchAction('data', {filterOrig}, j);
          }
        }
      }

      let displayedItemsLength = 0;

      for (let i = 0, l = selectorsOrig.length; i < l; i++) {
        const selectorOrig = selectorsOrig[i];
        const selectorNew = selectorsNew[i];

        if (!requerioP || !requerioP.$orgs || !requerioP.$orgs[selectorOrig]) {
          continue;
        }

        $orgs[selectorNew].dispatchAction('css', {display: 'list-item'});
        displayedItemsLength++;

        if (selectorOrig === 'window' || selectorOrig === 'document') {
          continue;
        }

        $orgs[selectorNew].on('mouseenter', () => {
          const patternOrgState = requerioP.$orgs[selectorOrig].getState();

          // Using additional logic in case elements already have a contrast filter.
          for (let j = 0; j < patternOrgState.members; j++) {
            const filterOrig = patternOrgState.$members[j].data.filterOrig;
            const contrastOrig = filterOrig && filterOrig.includes('contrast(') && filterOrig
              .replace(/^.*contrast\(/, '')
              .replace(/\).*$/, '');

            if (contrastOrig) {
              const contrastOrigFloat = parseFloat(contrastOrig);
              const filterSplit = filterOrig.split('contrast(');
              const filter0 = filterSplit[0];
              const filterSplitSplit = filterSplit[1].split(')');
              filterSplitSplit[0] = '';
              const filter1 = filterSplitSplit.join(')');
              let contrastNew;

              if (contrastOrigFloat < 0.25) {
                contrastNew = contrastOrigFloat + 0.25;
              }
              else if (contrastOrigFloat > 1) {
                contrastNew = 0.75;
              }
              else {
                contrastNew = contrastOrigFloat - 0.25;
              }

              requerioP.$orgs[selectorOrig].dispatchAction(
                'css',
                {filter: filter0 + 'contrast(' + contrastNew + filter1},
                j
              );
            }
            else {
              requerioP.$orgs[selectorOrig].dispatchAction('css', {filter: 'contrast(0.75)'}, j);
            }
          }
        });

        $orgs[selectorNew].on('mouseleave', () => {
          const patternOrgState = requerioP.$orgs[selectorOrig].getState();

          // Using additional logic in case elements already have a contrast filter.
          for (let j = 0; j < patternOrgState.members; j++) {
            const filter = patternOrgState.$members[j].data.filterOrig;

            if (filter) {
              requerioP.$orgs[selectorOrig].dispatchAction('css', {filter}, j);
            }
            else {
              requerioP.$orgs[selectorOrig].dispatchAction('css', {filter: 'contrast(1)'}, j);
            }
          }
        });

        requerioP.$orgs[selectorOrig].on('mouseenter', () => {
          $orgs[selectorNew].dispatchAction('addClass', 'highlighted');
        });

        requerioP.$orgs[selectorOrig].on('mouseleave', () => {
          $orgs[selectorNew].dispatchAction('removeClass', 'highlighted');
        });
      }

      if (!displayedItemsLength) {
        this.hideRequerioShowNa();

        return;
      }

      // If you've made it this far, show Requerio and hide NA.
      this.$orgs['#sg-code-pane-requerio'].dispatchAction('css', {display: 'block'});
      this.$orgs['#sg-code-pane-requerio-na'].dispatchAction('css', {display: 'none'});

      $orgs['li.sg-code-tree-requerio-branch>.clickable'].on('click', function () {
        requerioInspector.toggleExpandableBranch(this.parentElement);
      });

      let patternStoreStateBefore = requerioP.store.getState();

      for (const patternOrgKey of Object.keys(requerioP.$orgs)) {
        const patternOrg = requerioP.$orgs[patternOrgKey];

        // Set a temporary data value for window and document so in the setInterval() block,
        // a change gets picked up and their corresponding HTML get redrawn.
        if (patternOrgKey === 'window' || patternOrgKey === 'window') {
          patternOrg.dispatchAction('data', {stoked: false});
        }
        // Get targeted states of $members of $organisms. This will write their measurements to the state.
        else if (patternOrg) {
          for (let i = 0, l = patternOrg.$members.length; i < l; i++) {
            requerioP.$orgs[patternOrgKey].getState(i);
          }
        }
      }

      setInterval(() => {
        if (this.codeViewer.codeActive && this.codeViewer.tabActive === 'requerio') {
          let patternStoreStateNow;

          if (this.stoked) {
            patternStoreStateNow = requerioP.store.getState();

            for (const organism of Object.keys(patternStoreStateNow)) {
              requerioP.$orgs[organism].updateMeasurements(patternStoreStateNow[organism]);
            }
          }
          else {
            for (const patternOrgKey of Object.keys(requerioP.$orgs)) {
              const patternOrg = requerioP.$orgs[patternOrgKey];

              // Unset temporary data.
              if (patternOrgKey === 'window' || patternOrgKey === 'window') {
                patternOrg.dispatchAction('removeData', 'stoked');
              }
            }

            this.stoked = true;
            patternStoreStateNow = requerioP.store.getState();
          }

          if (patternStoreStateBefore !== patternStoreStateNow) {
            this.requerioInspector.recurseStatesAndDom(
              patternStoreStateBefore,
              patternStoreStateNow,
              $orgs['#sg-code-tree-requerio-trunk'][0].children
            );

            patternStoreStateBefore = patternStoreStateNow;
          }
        }
      }, 250);
    });
  }

  hideRequerioShowNa() {
    this.$orgs['#sg-code-pane-requerio'].dispatchAction('html', this.requerioInspector.htmlOrig);
    this.$orgs['#sg-code-pane-requerio'].dispatchAction('css', {display: 'none'});
    this.$orgs['#sg-code-pane-requerio-na'].dispatchAction('css', {display: 'block'});
  }
}
