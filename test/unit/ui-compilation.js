import {expect} from 'chai';

import fepperUi from '../unit';

const $orgs = fepperUi.requerio.$orgs;
const uiComp = fepperUi.uiComp;

const timeout = 10;

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
        expect($sgAccHandleMemberBefore.classArray).to.not.include('active');
        expect($sgAccPanelMemberBefore.classArray).to.not.include('active');

        expect($sgAccHandleMemberAfter.classArray).to.include('active');
        expect($sgAccPanelMemberAfter.classArray).to.include('active');
      }
      else {
        if (i > 1) {
          expect($sgAccHandleMemberBefore.classArray).to.include('active');
          expect($sgAccPanelMemberBefore.classArray).to.include('active');
        }

        expect($sgAccHandleMemberAfter.classArray).to.not.include('active');
        expect($sgAccPanelMemberAfter.classArray).to.not.include('active');
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
        expect($sgAccHandleMemberBefore.classArray).to.include('active');
        expect($sgAccPanelMemberBefore.classArray).to.include('active');
      }

      expect($sgAccHandleMemberAfter.classArray).to.not.include('active');
      expect($sgAccPanelMemberAfter.classArray).to.not.include('active');
    }
  });

  it('.sgNavToggleClick() toggles on', function () {
    const sgNavTargetStateBefore = $orgs['#sg-nav-target'].getState();

    uiComp.sgNavToggleClick({preventDefault: () => {}});

    const sgNavTargetStateAfter = $orgs['#sg-nav-target'].getState();

    expect(sgNavTargetStateBefore.classArray).to.not.include('active');

    expect(sgNavTargetStateAfter.classArray).to.include('active');
  });

  it('.sgNavToggleClick() toggles off', function () {
    const sgNavTargetStateBefore = $orgs['#sg-nav-target'].getState();

    uiComp.sgNavToggleClick({preventDefault: () => {}});

    const sgNavTargetStateAfter = $orgs['#sg-nav-target'].getState();

    expect(sgNavTargetStateBefore.classArray).to.include('active');

    expect(sgNavTargetStateAfter.classArray).to.not.include('active');
  });

  it('.sgTAnnotationsClick() toggles on', function (done) {
    fepperUi.annotationsViewer.stoke();
    fepperUi.viewerHandler.stoke();
    $orgs['#sg-code-container'].dispatchAction('css', {bottom: 'auto'});
    $orgs['#sg-t-code'].dispatchAction('addClass', 'active');

    const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
    const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();
    const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();
    const sgViewContainerStateBefore = $orgs['#sg-view-container'].getState();

    uiComp.sgTAnnotationsClick({preventDefault: () => {}});

    setTimeout(() => {
      const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();
      const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();
      const sgViewContainerStateAfter = $orgs['#sg-view-container'].getState();

      expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
      expect(sgTCodeStateBefore.classArray).to.include('active');
      expect(sgTAnnotationsStateBefore.classArray).to.not.include('active');
      expect(sgViewContainerStateBefore.classArray).to.not.include('anim-ready');

      expect(patternlabBodyAfter.classArray).to.include('dock-open');
      expect(sgTCodeStateAfter.classArray).to.not.include('active');
      expect(sgTAnnotationsStateAfter.classArray).to.include('active');
      expect(sgViewContainerStateAfter.classArray).to.include('anim-ready');

      done();
    }, timeout);
  });

  it('.sgTAnnotationsClick() toggles off', function (done) {
    fepperUi.annotationsViewer.viewall = true;

    const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
    const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();
    const sgViewContainerStateBefore = $orgs['#sg-view-container'].getState();

    uiComp.sgTAnnotationsClick({preventDefault: () => {}});

    setTimeout(() => {
      const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
      const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();
      const sgViewContainerStateAfter = $orgs['#sg-view-container'].getState();

      expect(patternlabBodyBefore.classArray).to.include('dock-open');
      expect(sgTAnnotationsStateBefore.classArray).to.include('active');
      expect(sgViewContainerStateBefore.classArray).to.include('anim-ready');

      expect(patternlabBodyAfter.classArray).to.not.include('dock-open');
      expect(sgTAnnotationsStateAfter.classArray).to.not.include('active');
      expect(sgViewContainerStateAfter.classArray).to.not.include('anim-ready');

      done();
    }, timeout);
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

    expect(JSON.stringify(sgTCodeStateBefore.classArray))
      .to.equal(JSON.stringify(sgTCodeStateAfter.classArray));
    expect(sgAnnotationsContainerStateBefore.css.bottom).to.equal(sgAnnotationsContainerStateAfter.css.bottom);
    expect(JSON.stringify(sgTAnnotationsStateBefore.classArray))
      .to.equal(JSON.stringify(sgTAnnotationsStateAfter.classArray));
  });

  it('.sgTCodeClick() toggles on', function (done) {
    fepperUi.codeViewer.stoke();
    fepperUi.viewerHandler.stoke();
    $orgs['#sg-t-annotations'].dispatchAction('addClass', 'active');
    $orgs['#sg-t-code'].dispatchAction('removeClass', 'active');

    const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
    const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();
    const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();
    const sgViewContainerStateBefore = $orgs['#sg-view-container'].getState();
    fepperUi.annotationsViewer.annotationsActive = true;
    fepperUi.codeViewer.codeActive = false;

    uiComp.sgTCodeClick({preventDefault: () => {}});

    setTimeout(() => {
      const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
      const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();
      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();
      const sgViewContainerStateAfter = $orgs['#sg-view-container'].getState();

      expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
      expect(sgTAnnotationsStateBefore.classArray).to.include('active');
      expect(sgTCodeStateBefore.classArray).to.not.include('active');
      expect(sgViewContainerStateBefore.classArray).to.not.include('anim-ready');

      expect(patternlabBodyAfter.classArray).to.include('dock-open');
      expect(sgTAnnotationsStateAfter.classArray).to.not.include('active');
      expect(sgTCodeStateAfter.classArray).to.include('active');
      expect(sgViewContainerStateAfter.classArray).to.include('anim-ready');
      expect(fepperUi.annotationsViewer.annotationsActive).to.be.false;
      expect(fepperUi.codeViewer.codeActive).to.be.true;

      done();
    }, timeout);
  });

  it('.sgTCodeClick() toggles off', function (done) {
    fepperUi.codeViewer.viewall = true;

    const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
    const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();
    const sgViewContainerStateBefore = $orgs['#sg-view-container'].getState();

    uiComp.sgTCodeClick({preventDefault: () => {}});

    setTimeout(() => {
      const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();
      const sgViewContainerStateAfter = $orgs['#sg-view-container'].getState();

      expect(patternlabBodyBefore.classArray).to.include('dock-open');
      expect(sgTCodeStateBefore.classArray).to.include('active');
      expect(sgViewContainerStateBefore.classArray).to.include('anim-ready');

      expect(patternlabBodyAfter.classArray).to.not.include('dock-open');
      expect(sgTCodeStateAfter.classArray).to.not.include('active');
      expect(sgViewContainerStateAfter.classArray).to.not.include('anim-ready');
      expect(fepperUi.codeViewer.codeActive).to.be.false;

      done();
    }, timeout);
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

    expect(JSON.stringify(sgTAnnotationsStateBefore.classArray))
      .to.equal(JSON.stringify(sgTAnnotationsStateAfter.classArray));
    expect(sgCodeContainerStateBefore.css.bottom).to.equal(sgCodeContainerStateAfter.css.bottom);
    expect(JSON.stringify(sgTCodeStateBefore.classArray)).to.equal(JSON.stringify(sgTCodeStateAfter.classArray));
  });
});
