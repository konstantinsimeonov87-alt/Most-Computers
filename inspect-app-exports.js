const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.location = dom.window.location;

// Minimal localStorage stub (jest provides one)
const store = {};
global.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
  clear: () => { for (const k in store) delete store[k]; },
};

global.window.matchMedia = global.window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {} }));

try {
  const mod = require('../app.js');
  console.log('exports:', Object.keys(mod));
  console.log('runActionString type:', typeof mod.runActionString);
} catch (e) {
  console.error('error requiring app.js', e);
}
