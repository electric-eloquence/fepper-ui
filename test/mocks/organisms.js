const $orgs = global.FEPPER_UI.requerio.$orgs;

$orgs['#sg-viewport'][0].contentWindow = {
  location: {
    replace: () => {}
  },
  postMessage: () => {}
};
$orgs['#sg-code-panel-feplet'][0].addEventListener = () => {};
$orgs['#sg-code-panel-feplet'][0].contentWindow = {
  document: {
    documentElement: {
      offsetHeight: 100
    }
  },
  location: {
    replace: () => {}
  }
};
$orgs['#sg-annotations-container'].animate = () => {};

$orgs.window.dispatchAction('innerWidth', 1024);
$orgs.window.dispatchAction('innerHeight', 768);
$orgs.window.dispatchAction('innerHeight', 768);
$orgs['#sg-view-container'].dispatchAction('innerHeight', 384);
