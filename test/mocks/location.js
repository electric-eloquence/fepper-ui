module.exports = ($orgs) => {
  global.location = {
    host: 'localhost:3000',
    pathname: '/',
    protocol: 'http:',
    search: ''
  };

  if ($orgs['#sg-code-panel-feplet']) {
    delete $orgs['#sg-code-panel-feplet'][0].contentWindow.location;

    $orgs['#sg-code-panel-feplet'][0].contentWindow.location = {
      replace: (href) => {
        $orgs['#sg-code-panel-feplet'][0].contentWindow.location.href = href;
      }
    };
  }

  if ($orgs['#sg-viewport']) {
    delete $orgs['#sg-viewport'][0].contentWindow.location;

    $orgs['#sg-viewport'][0].contentWindow.location = {
      replace: (href) => {
        $orgs['#sg-viewport'][0].contentWindow.location.href = href;
      }
    };
  }
};
