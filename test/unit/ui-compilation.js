import {expect} from 'chai';

import fepperUi from '../unit';

const $orgs = fepperUi.requerio.$orgs;
const uiComp = fepperUi.uiComp;

describe('uiComp', function () {
  it('.sgAccHandleClick() toggles on', function () {
    const sgAccHandleLength = $orgs['.sg-acc-handle'].length;

    for (let i = 0; i < sgAccHandleLength; i++) {
      if (i > 1) {
        $orgs['.sg-acc-handle'].dispatchAction('addClass', 'active', i);
        $orgs['.sg-acc-panel'].dispatchAction('addClass', 'active', i);
      }
    }

    const sgAccHandleStateBefore = $orgs['.sg-acc-handle'].getState();
    const sgAccPanelStateBefore = $orgs['.sg-acc-panel'].getState();
    const sgAccHandleClickBound = uiComp.sgAccHandleClick.bind($orgs['.sg-acc-handle'][0]);

    sgAccHandleClickBound({preventDefault: () => {}});

    const sgAccHandleStateAfter = $orgs['.sg-acc-handle'].getState();
    const sgAccPanelStateAfter = $orgs['.sg-acc-panel'].getState();

    for (let i = 0; i < sgAccHandleLength; i++) {
      const $sgAccHandleMemberBefore = sgAccHandleStateBefore.$members[i];
      const $sgAccPanelMemberBefore = sgAccPanelStateBefore.$members[i];
      const $sgAccHandleMemberAfter = sgAccHandleStateAfter.$members[i];
      const $sgAccPanelMemberAfter = sgAccPanelStateAfter.$members[i];

      if (i === 0) {
        expect($sgAccHandleMemberBefore.classList).to.not.include('active');
        expect($sgAccPanelMemberBefore.classList).to.not.include('active');

        expect($sgAccHandleMemberAfter.classList).to.include('active');
        expect($sgAccPanelMemberAfter.classList).to.include('active');
      }
      else {
        if (i > 1) {
          expect($sgAccHandleMemberBefore.classList).to.include('active');
          expect($sgAccPanelMemberBefore.classList).to.include('active');
        }

        expect($sgAccHandleMemberAfter.classList).to.not.include('active');
        expect($sgAccPanelMemberAfter.classList).to.not.include('active');
      }
    }
  });

  it('.sgAccHandleClick() toggles off', function () {
    const sgAccHandleLength = $orgs['.sg-acc-handle'].length;
    const sgAccHandleStateBefore = $orgs['.sg-acc-handle'].getState();
    const sgAccPanelStateBefore = $orgs['.sg-acc-panel'].getState();
    const sgAccHandleClickBound = uiComp.sgAccHandleClick.bind($orgs['.sg-acc-handle'][0]);

    sgAccHandleClickBound({preventDefault: () => {}});

    const sgAccHandleStateAfter = $orgs['.sg-acc-handle'].getState();
    const sgAccPanelStateAfter = $orgs['.sg-acc-panel'].getState();

    for (let i = 0; i < sgAccHandleLength; i++) {
      const $sgAccHandleMemberBefore = sgAccHandleStateBefore.$members[i];
      const $sgAccPanelMemberBefore = sgAccPanelStateBefore.$members[i];
      const $sgAccHandleMemberAfter = sgAccHandleStateAfter.$members[i];
      const $sgAccPanelMemberAfter = sgAccPanelStateAfter.$members[i];

      if (i === 0) {
        expect($sgAccHandleMemberBefore.classList).to.include('active');
        expect($sgAccPanelMemberBefore.classList).to.include('active');
      }

      expect($sgAccHandleMemberAfter.classList).to.not.include('active');
      expect($sgAccPanelMemberAfter.classList).to.not.include('active');
    }
  });

  it('.sgNavToggleClick() toggles on', function () {
    const sgNavTargetStateBefore = $orgs['#sg-nav-target'].getState();

    uiComp.sgNavToggleClick({preventDefault: () => {}});

    const sgNavTargetStateAfter = $orgs['#sg-nav-target'].getState();

    expect(sgNavTargetStateBefore.classList).to.not.include('active');

    expect(sgNavTargetStateAfter.classList).to.include('active');
  });

  it('.sgNavToggleClick() toggles off', function () {
    const sgNavTargetStateBefore = $orgs['#sg-nav-target'].getState();

    uiComp.sgNavToggleClick({preventDefault: () => {}});

    const sgNavTargetStateAfter = $orgs['#sg-nav-target'].getState();

    expect(sgNavTargetStateBefore.classList).to.include('active');

    expect(sgNavTargetStateAfter.classList).to.not.include('active');
  });

  it('.sgTAnnotationsClick() toggles on', function () {
    fepperUi.annotationsViewer.stoke();
    $orgs['#sg-code-container'].dispatchAction('css', {bottom: 'auto'});
    $orgs['#sg-t-code'].dispatchAction('addClass', 'active');

    const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();
    const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
    const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();

    uiComp.sgTAnnotationsClick({preventDefault: () => {}});

    const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();
    const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
    const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();

    expect(sgTCodeStateBefore.classList).to.include('active');
    expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);
    expect(sgTAnnotationsStateBefore.classList).to.not.include('active');

    expect(sgTCodeStateAfter.classList).to.not.include('active');
    expect(sgCodeContainerStateAfter.style.bottom).to.equal('-384px');
    expect(sgTAnnotationsStateAfter.classList).to.include('active');
  });

  it('.sgTAnnotationsClick() toggles off', function () {
    fepperUi.annotationsViewer.viewall = true;

    const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();
    const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();

    uiComp.sgTAnnotationsClick({preventDefault: () => {}});

    const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();
    const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();

    expect(sgAnnotationsContainerStateBefore.style.bottom).to.not.equal(sgAnnotationsContainerStateAfter.style.bottom);
    expect(sgTAnnotationsStateBefore.classList).to.include('active');

    expect(sgAnnotationsContainerStateAfter.style.bottom).to.equal('-384px');
    expect(sgTAnnotationsStateAfter.classList).to.not.include('active');
  });

  it('.sgTAnnotationsClick() does nothing if annotationsViewer.mustacheBrowser is true', function () {
    fepperUi.annotationsViewer.mustacheBrowser = true;

    const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();
    const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();
    const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();

    uiComp.sgTAnnotationsClick({preventDefault: () => {}});

    const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();
    const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();
    const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();

    expect(JSON.stringify(sgTCodeStateBefore.classList))
      .to.equal(JSON.stringify(sgTCodeStateAfter.classList));
    expect(sgAnnotationsContainerStateBefore.style.bottom).to.equal(sgAnnotationsContainerStateAfter.style.bottom);
    expect(JSON.stringify(sgTAnnotationsStateBefore.classList))
      .to.equal(JSON.stringify(sgTAnnotationsStateAfter.classList));
  });

  it('.sgTCodeClick() toggles on', function () {
    fepperUi.codeViewer.stoke();
    $orgs['#sg-t-annotations'].dispatchAction('addClass', 'active');
    $orgs['#sg-annotations-container'].dispatchAction('css', {bottom: 'auto'});
    $orgs['#sg-t-code'].dispatchAction('removeClass', 'active');

    const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();
    const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();
    const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();
    fepperUi.annotationsViewer.annotationsActive = true;
    fepperUi.codeViewer.codeActive = false;

    uiComp.sgTCodeClick({preventDefault: () => {}});

    const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();
    const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();
    const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();

    expect(sgTAnnotationsStateBefore.classList).to.include('active');
    expect(sgAnnotationsContainerStateBefore.style.bottom).to.not.equal(sgAnnotationsContainerStateAfter.style.bottom);
    expect(sgTCodeStateBefore.classList).to.not.include('active');

    expect(sgTAnnotationsStateAfter.classList).to.not.include('active');
    expect(sgAnnotationsContainerStateAfter.style.bottom).to.equal('-384px');
    expect(sgTCodeStateAfter.classList).to.include('active');
    expect(fepperUi.annotationsViewer.annotationsActive).to.be.false;
    expect(fepperUi.codeViewer.codeActive).to.be.true;
  });

  it('.sgTCodeClick() toggles off', function () {
    fepperUi.codeViewer.viewall = true;

    const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
    const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();

    uiComp.sgTCodeClick({preventDefault: () => {}});

    const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
    const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();

    expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);
    expect(sgTCodeStateBefore.classList).to.include('active');

    expect(sgCodeContainerStateAfter.style.bottom).to.equal('-384px');
    expect(sgTCodeStateAfter.classList).to.not.include('active');
    expect(fepperUi.codeViewer.codeActive).to.be.false;
  });

  it('.sgTCodeClick() does nothing if codeViewer.mustacheBrowser is true', function () {
    fepperUi.codeViewer.mustacheBrowser = true;

    const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();
    const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
    const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();

    uiComp.sgTCodeClick({preventDefault: () => {}});

    const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();
    const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
    const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();

    expect(JSON.stringify(sgTAnnotationsStateBefore.classList))
      .to.equal(JSON.stringify(sgTAnnotationsStateAfter.classList));
    expect(sgCodeContainerStateBefore.style.bottom).to.equal(sgCodeContainerStateAfter.style.bottom);
    expect(JSON.stringify(sgTCodeStateBefore.classList)).to.equal(JSON.stringify(sgTCodeStateAfter.classList));
  });
});
