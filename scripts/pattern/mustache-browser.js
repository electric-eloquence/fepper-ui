((d) => {
  // Only run when loaded from within the iframe.
  if (parent === window) {
    return;
  }

  // Only run in Mustache Browser.
  if (!d.documentElement.classList.contains('mustache-browser')) {
    return;
  }

  function selectAndCopy(node, button) {
    let range;
    let selection;

    try {
      range = document.createRange();
      selection = window.getSelection();

      range.selectNodeContents(node);
      selection.removeAllRanges();
    }
    catch (err) {
      /* eslint-disable no-console */
      console.error(err);
      console.error('Selection failed!');

      return;
    }

    try {
      const origMsg = button.innerHTML;
      const origWidth = button.getBoundingClientRect().width;
      const copiedMsg = button.dataset.copiedMsg;

      selection.addRange(range);
      document.execCommand('copy');

      button.style.width = origWidth + 'px';
      button.innerHTML = copiedMsg;

      setTimeout(() => {
        selection.removeAllRanges();

        button.innerHTML = origMsg;
      }, 5000);
    }
    catch (err) {
      console.error(err);
      console.error('Copy failed!');
      /* eslint-enable no-console */

      return;
    }
  }

  const pathAbs = d.getElementById('mustache-browser__path--absolute');
  const pathRel = d.getElementById('mustache-browser__path--relative');
  const pathButtonAbs = d.getElementById('mustache-browser__button--absolute');
  const pathButtonRel = d.getElementById('mustache-browser__button--relative');

  // Select and copy the absolute path to the pattern.
  pathButtonAbs.addEventListener('click', () => {
    pathAbs.style.visibility = 'visible';
    pathRel.style.display = 'none';
    selectAndCopy(pathAbs, pathButtonAbs);
  });

  // Select and copy the relative path to the pattern.
  pathButtonRel.addEventListener('click', () => {
    pathAbs.style.visibility = 'hidden';
    pathRel.style.display = 'block';
    selectAndCopy(pathRel, pathButtonRel);
  });
})(document);
