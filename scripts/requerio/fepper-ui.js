import UiFns from '../ui/functions.js';
import UiProps from '../ui/properties.js';
import DataSaver from '../classes/data-saver.js';
import AnnotationsViewer from '../classes/annotations-viewer.js';
import CodeViewer from '../classes/code-viewer.js';
import PatternFinder from '../classes/pattern-finder.js';
import PatternlabViewer from '../classes/patternlab-viewer.js';
import Timestamper from '../classes/timestamper.js';
import UrlHandler from '../classes/url-handler.js';

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
    this.patternlabViewer = new PatternlabViewer(this, root);
    this.timestamper = new Timestamper(this, root);
    this.urlHandler = new UrlHandler(this, root);

    // uiComp depends on this global.
    root.FEPPER_UI = this;

    // uiComp allows for UI customization. Define this later so tests can use a fixed (non-customized) compilation.
    this.uiComp = null;
  }
}
