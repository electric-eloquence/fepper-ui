const $orgs = global.FEPPER_UI.requerio.$orgs;

$orgs['#sg-viewport'].one = (eventName, callback) => {
  callback();
};
$orgs['#sg-viewport'][0].contentWindow = {
  location: {
    href: '',
    replace: (href) => {
      $orgs['#sg-viewport'][0].contentWindow.location.href = href;
    }
  },
  postMessage: () => {}
};
$orgs['#sg-code-panel-feplet'].on = (eventName, callback) => {
  callback();
};
$orgs['#sg-code-panel-feplet'].one = (eventName, callback) => {
  callback();
};
$orgs['#sg-code-panel-feplet'][0].addEventListener = (eventName, callback) => {
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
