export default class RequerioInspector {
  constructor(fepperUi) {
    this.codeViewer = fepperUi.codeViewer;
    this.$orgs = fepperUi.requerio.$orgs;
    this.poll = true;
    this.requerio = fepperUi.requerio;
    this.requerioInspector = fepperUi.requerioInspector;
    this.stoked = false;
  }

  listen() {
    const $orgs = this.$orgs;

    $orgs['#sg-viewport'].on('load', () => {
      if (this.interval) {
        this.interval = clearInterval(this.interval);
      }

      const classesNew = [];
      const requerioInspector = this.requerioInspector;
      const requerioP = $orgs['#sg-viewport'][0].contentWindow.requerio;
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

      const selectorsOrigLength = selectorsOrig.length;

      // Using additional logic in case elements already have a contrast filter.
      for (let i = 0; i < selectorsOrigLength; i++) {
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

      for (let i = 0; i < selectorsOrigLength; i++) {
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

      this.interval = setInterval(() => {
        // Poll 4 times a second continuously for 10 minutes. Reduce or stop the polling when inactive.
        // Polling stops when switching to a different browser tab.
        // Polling restarts when switching back to this tab.
        // pollCount resets to 0 when:
        // 1. Switching to a different tab and then switching back.
        // 2. Mouse moves within the UI document.
        // 3. Mouse moves within the pattern iframe document.
        // If pollCount reaches 2400 (10 minutes), polling will only occur every 4 seconds unless pollCount resets to 0.
        //
        // Cannot reasonably test with automation. Instead:
        // 1. Check that the polling slows after exceeding pollCount threshold.
        // 2. Check that the polling stops when switching to a different browser tab.
        // 2. Check that the polling resets and restarts when switching back to this tab.
        // 3. Check that pollCount resets when mouse moves within the UI document.
        // 3. Check that pollCount resets when mouse moves within the pattern iframe document.
        if (this.poll) {
          if (this.requerioInspector.pollCount < 2400 || this.requerioInspector.pollCount % 16 === 0) {
          // eslint-disable-next-line max-len
          // if (this.requerioInspector.pollCount < 40 || this.requerioInspector.pollCount % 16 === 0) { // DEBUGGING ONLY

            if (this.codeViewer.codeActive && this.codeViewer.tabActive === 'requerio') {
              // console.log(Math.floor(Date.now() / 1000), this.requerioInspector.pollCount); // DEBUGGING ONLY

              const patternStoreStateBeforeString = JSON.stringify(patternStoreStateBefore);
              let patternStoreStateNow;
              let patternStoreStateNowString;

              if (this.stoked) {
                for (const organism of Object.keys(patternStoreStateBefore)) {
                  const $organism = requerioP.$orgs[organism];
                  const memberIdxs = $organism.$members.map((val, idx) => idx);

                  for (let memberIdx of memberIdxs) {
                    $organism.getState(memberIdx);
                  }

                  $organism.updateMeasurements(patternStoreStateBefore[organism]);
                }

                patternStoreStateNow = requerioP.store.getState();
                patternStoreStateNowString = JSON.stringify(patternStoreStateNow);
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
                patternStoreStateNowString = JSON.stringify(patternStoreStateNow);
              }

              if (patternStoreStateBeforeString !== patternStoreStateNowString) {
                this.requerioInspector.recurseStatesAndDom(
                  patternStoreStateBefore,
                  patternStoreStateNow,
                  $orgs['#sg-code-tree-requerio-trunk'][0].children
                );

                patternStoreStateBefore = patternStoreStateNow;
              }
            }
          }

          this.requerioInspector.pollCount++;
        }
      }, 250);

      // Add an event listener for mousemoves within the iframe. Necessary because mousemoves within the iframe will not
      // trigger events on the UI document.
      $orgs['#sg-viewport'][0].contentWindow.document.addEventListener('mousemove', () => {
        this.requerioInspector.pollCount = 0;
      });
    });

    // Reset pollCount if there is a mousemove within the document of the UI.
    document.addEventListener('mousemove', () => {
      this.requerioInspector.pollCount = 0;
    });

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.poll = true;
        this.requerioInspector.pollCount = 0;
      }
      // Stop polling if switching to a different browser tab.
      else {
        this.poll = false;
      }
    });

    $orgs['#sg-viewport'].on('load', () => {
      const logo = $orgs['#sg-viewport'][0].contentWindow.document.querySelector('.img-alt-h1 > .logo');

      if (logo && logo.title === 'Fepper Demo Site') {
        $orgs['#sg-code-requerio-demo-link-container'].dispatchAction('css', {display: 'block'});
        $orgs['#sg-code-main-distro-link-container'].dispatchAction('css', {display: 'none'});
      }
      else {
        $orgs['#sg-code-requerio-demo-link-container'].dispatchAction('css', {display: 'none'});
        $orgs['#sg-code-main-distro-link-container'].dispatchAction('css', {display: 'block'});
      }
    });
  }

  hideRequerioShowNa() {
    this.$orgs['#sg-code-pane-requerio'].dispatchAction('html', this.requerioInspector.htmlOrig);
    this.$orgs['#sg-code-pane-requerio'].dispatchAction('css', {display: 'none'});
    this.$orgs['#sg-code-pane-requerio-na'].dispatchAction('css', {display: 'block'});
  }
}
