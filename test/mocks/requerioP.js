// This is abstracted away from the requerio-inspector.js unit test so it doesn't accidentally get deleted.
// We cannot simulate the separate iframe window context in JSDOM, so we're just using a stripped down version of
// fixtures/index.html.
module.exports = (requerio, $orgs) => {
  $orgs['#sg-viewport'][0].contentWindow.requerio = requerio;

  return requerio;
};
