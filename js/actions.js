// migrate any remaining inline onclick attributes into data-action
function migrateInlineClickHandlers() {
  document.querySelectorAll('[onclick]').forEach(el => {
    const code = el.getAttribute('onclick');
    if (!code) return;
    if (code.includes('this.')) return; // skip — requires DOM context
    // remove return false and trim
    let action = code.replace(/return\s+false;?/g, '').trim();
    // strip trailing parentheses for simple calls
    action = action.replace(/\(\)\s*;?$/, '');
    el.dataset.action = action;
    el.removeAttribute('onclick');
  });

  // Remove redundant onkeydown handlers that only simulate click for keyboard users
  document.querySelectorAll('[onkeydown]').forEach(el => {
    const code = el.getAttribute('onkeydown');
    if (!code) return;
    // if the handler just triggers click on Enter/Space (handled by our keyboard handler), drop it
    if (/this\.click\(\)/.test(code)) {
      el.removeAttribute('onkeydown');
    }
  });
}

// parse and execute a data-action string
function runActionString(str, event, button) {
  if (!str) return;
  str.split(';').forEach(cmd => {
    cmd = cmd.trim();
    if (!cmd) return;
    // Handle functionName('arg') / functionName(123) call syntax
    const callMatch = cmd.match(/^(\w+)\((.*)\)$/);
    if (callMatch) {
      const fn = window[callMatch[1]];
      if (typeof fn === 'function') {
        const argsStr = callMatch[2].trim();
        const args = argsStr
          ? argsStr.split(',').map(a => {
              const wasQuoted = /^['"`]/.test(a.trim());
              a = a.trim().replace(/^['"`]|['"`]$/g, '');
              if (!wasQuoted) {
                if (a === 'this' || a === 'self') return button;
                if (a === 'event') return event;
                if (!isNaN(a) && a !== '') return Number(a);
              }
              return a;
            })
          : [];
        fn.apply(null, args);
      }
      return;
    }
    // Colon syntax: functionName:arg1,arg2
    const [fnName, ...rawArgs] = cmd.split(':');
    const fn = window[fnName];
    if (typeof fn === 'function') {
      let args = [];
      if (rawArgs.length) {
        args = rawArgs.join(':').split(',').map(a => {
          a = a.trim();
          if (a === 'event') return event;
          if (a === 'this' || a === 'self') return button;
          if (a === '') return '';
          if (!isNaN(a)) return Number(a);
          return a;
        });
      }
      fn.apply(null, args);
    }
  });
}

let _dataActionsInited = false;
function initDataActions() {
  if (_dataActionsInited) return;
  _dataActionsInited = true;

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    runActionString(button.dataset.action, event, button);
  });

  // Keyboard support for focusable action elements
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const button = event.target.closest('[data-action]');
    if (!button) return;
    event.preventDefault();
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    button.dispatchEvent(clickEvent);
  });

  migrateInlineClickHandlers();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    migrateInlineClickHandlers,
    runActionString,
    initDataActions,
  };
}
