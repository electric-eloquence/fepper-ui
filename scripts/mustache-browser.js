((d, uiProps) => {
  'use strict';

  const codeFill = d.getElementById('sg-code-fill');
  const codeTitle = d.getElementById('sg-code-title-mustache');

  if (codeFill) {
    // Give the PL Mustache code viewer the appearance of being linked.
    codeFill.addEventListener(
      'mouseover',
      function () {
        if (codeTitle.className.indexOf('sg-code-title-active') > -1) {
          codeFill.style.cursor = 'pointer';
        }
        else {
          codeFill.style.cursor = 'default';
        }
      },
      false
    );

    // Send to Fepper's Mustache browser when clicking the viewer's Mustache code.
    codeFill.addEventListener(
      'click',
      function () {
        if (codeTitle.className.indexOf('sg-code-title-active') > -1) {
          // Remove padding from viewport bottom.
          d.getElementById('sg-vp-wrap').style.paddingBottom = 0;

          // Close nav item.
          const sgView = d.getElementById('sg-view');
          sgView.style.height = 'auto';
          sgView.classList.remove('active');

          // Encode code for rendering.
          let code = encodeURIComponent(codeFill.innerHTML);
          // HTML entities for mustacheBrowser.spanTokensStrip() to work.
          code = code.replace(/><</g, '>&lt;<');
          code = code.replace(/><\/</g, '>&lt;/<');
          code = code.replace(/><!--/g, '>&lt;!--');

          // Load Mustache Browser
          const title = d.getElementById('title').innerHTML.replace('Fepper - ', '');
          const path = window.location.origin + '/mustache-browser/?title=' + title + '&code=' + code;
          uiProps.sgViewport.contentWindow.location.replace(path);

          // Close code viewer.
          window.codeViewer.closeCode();
        }
      },
      false
    );
  }
})(document, window.FEPPER_UI.uiProps);
