const $orgs = global.FEPPER_UI.requerio.$orgs;

$orgs['#sg-viewport'][0].contentWindow = {
  location: {
    replace: () => {}
  },
  postMessage: () => {}
};

$orgs.window.dispatchAction('innerWidth', 1024);
$orgs.window.dispatchAction('innerHeight', 768);
$orgs.window.dispatchAction('innerHeight', 768);
$orgs['#sg-view-container'].dispatchAction('innerHeight', 384);
