import UiFns from '../ui/functions.js';
import UiProps from '../ui/properties.js';
import DataSaver from '../classes/data-saver.js';
import AnnotationsViewer from '../classes/annotations-viewer.js';
import CodeViewer from '../classes/code-viewer.js';
import PatternFinder from '../classes/pattern-finder.js';
import PatternViewport from '../classes/pattern-viewport.js';
import Timestamper from '../classes/timestamper.js';
import UrlHandler from '../classes/url-handler.js';
import ViewerHandler from '../classes/viewer-handler.js';

export default class FepperUi {
  constructor(Requerio, jQueryOrCheerio, Redux, $organisms, root, uiData) {
    this.requerio = new Requerio(jQueryOrCheerio, Redux, $organisms);
    this.requerio.init();

    this.uiData = uiData;
    this.uiFns = new UiFns(this, root);
    this.uiProps = new UiProps(this, root);
    this.cookies = new root.UniversalCookie();
    this.dataSaver = new DataSaver('patternlab', this);
    this.annotationsViewer = new AnnotationsViewer(this, root);
    this.codeViewer = new CodeViewer(this, root);
    this.patternFinder = new PatternFinder(this, root);
    this.patternViewport = new PatternViewport(this, root);
    this.timestamper = new Timestamper(this, root);
    this.urlHandler = new UrlHandler(this, root);
    this.viewerHandler = new ViewerHandler(this);

    // uiComp depends on this global.
    root.FEPPER_UI = this;

    // uiComp allows for UI customization. Define this later so tests can use a fixed (non-customized) compilation.
    this.uiComp = null;

    // DEPRECATED: Here for backward-compatibility. Will be removed.
    this.patternlabViewer = {
      goRandom: this.patternViewport.goRandom.bind(this.patternViewport),
      goWhole: this.patternViewport.goWhole.bind(this.patternViewport)
    };

    // Also DEPRECATED:
    /* istanbul ignore if */
    if (typeof window === 'object') {
      const deprecationMessage = document.getElementById('deprecation-message-0.40.0');

      if (deprecationMessage && deprecationMessage.remove) {
        deprecationMessage.remove();
      }
    }
  }
}
