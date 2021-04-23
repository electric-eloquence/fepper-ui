const $orgs = global.FEPPER_UI.requerio.$orgs;

$orgs['#sg-viewport'][0].contentWindow = {
  location: {
    href: '',
    replace: (href) => {
      $orgs['#sg-viewport'][0].contentWindow.location.href = href;
    }
  },
  postMessage: () => {}
};
$orgs['#sg-code-panel-feplet'][0].addEventListener = (event, callback) => {
  callback();
};
$orgs['#sg-code-panel-feplet'][0].contentWindow = {
  document: {
    documentElement: {
      offsetHeight: 100
    }
  },
  location: {
    href: '',
    replace: (href) => {
      $orgs['#sg-code-panel-feplet'][0].contentWindow.location.href = href;
    }
  }
};
$orgs['#sg-annotations-container'].animate = () => {};

$orgs.window.dispatchAction('innerWidth', 1024);
$orgs.window.dispatchAction('innerHeight', 768);
$orgs.window.dispatchAction('innerHeight', 768);
$orgs['#sg-view-container'].dispatchAction('innerHeight', 384);
