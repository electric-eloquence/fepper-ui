if (parent !== window && window.Mousetrap) {
  const targetOrigin =
    (window.location.protocol === 'file:') ? '*' : window.location.protocol + '//' + window.location.host;

  window.Mousetrap.bind('ctrl+shift+f', (e) => {
    const messageObj = {event: 'patternlab.keyPress', keyPress: 'ctrl+shift+f'};

    parent.postMessage(messageObj, targetOrigin);

    e.preventDefault();
    return false;
  });
}
