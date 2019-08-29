const Mousetrap = window.Mousetrap;
const targetOrigin =
  (window.location.protocol === 'file:') ? '*' : window.location.protocol + '//' + window.location.host;

Mousetrap.bind('ctrl+shift+f', (e) => {
  const obj = {event: 'patternlab.keyPress', keyPress: 'ctrl+shift+f'};

  parent.postMessage(obj, targetOrigin);

  e.preventDefault();
  return false;
});
