// This takes the extra step of importing html-scraper-ajax.js in order to maintain backwards compatibility with older
// versions of Fepper.
// html-scraper-ajax.js is DEPRECATED and its operations will be moved here.
import './html-scraper-ajax.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/fepper-core/html-scraper.css';
link.media = 'all';
document.getElementsByTagName('head')[0].appendChild(link);
