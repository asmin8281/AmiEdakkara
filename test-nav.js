const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

(async function(){
  try {
    const indexPath = path.resolve(__dirname, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf8');

    const dom = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: 'usable',
      url: 'file://' + indexPath,
      beforeParse(window) {
        // minimal polyfills
        window.matchMedia = (q) => ({ matches: false, addListener: () => {}, removeListener: () => {} });
        window.IntersectionObserver = function(cb) { this.observe = () => {}; this.unobserve = () => {}; this.disconnect = () => {}; };
        // simple sessionStorage stub so script can read/write
        window.sessionStorage = {
          _store: {},
          getItem(k) { return this._store[k] ?? null; },
          setItem(k,v) { this._store[k] = String(v); },
          removeItem(k) { delete this._store[k]; }
        };
        // requestAnimationFrame stub
        window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
        // don't override window.location here (jsdom defines it non-configurable)
      }
    });

    const win = dom.window;
    const doc = win.document;

    await new Promise((resolve) => {
      // wait for external scripts to load
      doc.addEventListener('DOMContentLoaded', () => {
        // give extra time for external script execution
        setTimeout(resolve, 120);
      });
    });

  const hamburger = doc.querySelector('.hamburger');
  const navMenu = doc.querySelector('.nav-menu');
  const aboutLink = doc.querySelector('.nav-link[href="about.html"]');

    if (!hamburger) return console.error('FAIL: hamburger not found');
    if (!aboutLink) return console.error('FAIL: about link not found');

    // Simulate click on hamburger
    hamburger.dispatchEvent(new win.MouseEvent('click', { bubbles: true }));

    // Wait a short moment for nav open logic
    await new Promise(r => setTimeout(r, 80));

    // Simulate click on about link
    aboutLink.dispatchEvent(new win.MouseEvent('click', { bubbles: true }));

    // Wait to allow our click handler to run and set sessionStorage / close drawer
    await new Promise(r => setTimeout(r, 120));

    // Verify expected side-effects: sessionStorage flag set and drawer closed
    const navOpen = navMenu.classList.contains('active');
    const animFlag = win.sessionStorage && win.sessionStorage.getItem && win.sessionStorage.getItem('animateTextOnLoad');

    console.log('navMenu.active after click?', navOpen);
    console.log('sessionStorage.animateTextOnLoad =', animFlag);

    if (!navOpen && animFlag === '1') {
      console.log('PASS: click handler closed drawer and scheduled navigation (sessionStorage set)');
      process.exit(0);
    } else {
      console.error('FAIL: click handler did not perform expected actions');
      process.exit(2);
    }
  } catch (err) {
    console.error('ERROR', err);
    process.exit(3);
  }
})();
