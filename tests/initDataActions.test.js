const { runActionString, migrateInlineClickHandlers, initDataActions } = require('../../js/actions.js');

describe('runActionString', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('calls global function without args', () => {
    global.foo = jest.fn();
    runActionString('foo');
    expect(global.foo).toHaveBeenCalled();
  });

  test('passes numeric argument', () => {
    global.bar = jest.fn();
    runActionString('bar:123');
    expect(global.bar).toHaveBeenCalledWith(123);
  });

  test('handles multiple commands', () => {
    global.a = jest.fn();
    global.b = jest.fn();
    runActionString('a; b');
    expect(global.a).toHaveBeenCalled();
    expect(global.b).toHaveBeenCalled();
  });

  test('ignores unknown functions without throwing', () => {
    expect(() => runActionString('doesNotExist')).not.toThrow();
  });

  test('parses functionName("string") call syntax', () => {
    global.openCatPage = jest.fn();
    runActionString("openCatPage('laptop')");
    expect(global.openCatPage).toHaveBeenCalledWith('laptop');
  });

  test('parses functionName("string") with double quotes', () => {
    global.adminShowTab = jest.fn();
    runActionString('adminShowTab("dashboard")');
    expect(global.adminShowTab).toHaveBeenCalledWith('dashboard');
  });

  test('parses functionName(number) call syntax', () => {
    global.openPage = jest.fn();
    runActionString('openPage(42)');
    expect(global.openPage).toHaveBeenCalledWith(42);
  });

  test('parses multiple string args', () => {
    global.multiArg = jest.fn();
    runActionString("multiArg('hello','world')");
    expect(global.multiArg).toHaveBeenCalledWith('hello', 'world');
  });

  test('call syntax with trailing semicolon does not throw', () => {
    global.toggleSfb = jest.fn();
    expect(() => runActionString("toggleSfb('sfb-price');")).not.toThrow();
    expect(global.toggleSfb).toHaveBeenCalledWith('sfb-price');
  });

  test('mixed: call syntax + colon syntax in one string', () => {
    global.fnA = jest.fn();
    global.fnB = jest.fn();
    runActionString("fnA('x'); fnB:99");
    expect(global.fnA).toHaveBeenCalledWith('x');
    expect(global.fnB).toHaveBeenCalledWith(99);
  });
});

describe('migrateInlineClickHandlers', () => {
  test('converts onclick attr to data-action and removes onclick', () => {
    document.body.innerHTML = '<button id="x" onclick="foo()">x</button>';
    migrateInlineClickHandlers();
    const btn = document.getElementById('x');
    expect(btn.getAttribute('onclick')).toBeNull();
    expect(btn.dataset.action).toBe('foo');
  });

  test('removes return false and trailing parentheses', () => {
    document.body.innerHTML = '<button id="x" onclick="return false; foo();"></button>';
    migrateInlineClickHandlers();
    const btn = document.getElementById('x');
    expect(btn.dataset.action).toBe('foo');
  });

  test('removes keyboard-onkeydown handlers that just call this.click()', () => {
    document.body.innerHTML = '<div id="x" data-action="foo" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault(); this.click();}"></div>';
    migrateInlineClickHandlers();
    const el = document.getElementById('x');
    expect(el.getAttribute('onkeydown')).toBeNull();
  });
});

describe('initDataActions integration', () => {
  test('click on element triggers action', () => {
    global.clickFn = jest.fn();
    document.body.innerHTML = '<button id="b" data-action="clickFn">x</button>';
    initDataActions();
    document.getElementById('b').click();
    expect(global.clickFn).toHaveBeenCalled();
  });

  test('Enter key triggers action on focused element', () => {
    global.keyFn = jest.fn();
    document.body.innerHTML = '<button id="b" data-action="keyFn">x</button>';
    initDataActions();
    const btn = document.getElementById('b');
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    btn.dispatchEvent(event);
    expect(global.keyFn).toHaveBeenCalled();
  });

  test('Space key triggers action on focused element', () => {
    global.spaceFn = jest.fn();
    document.body.innerHTML = '<button id="b" data-action="spaceFn">x</button>';
    initDataActions();
    const btn = document.getElementById('b');
    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    btn.dispatchEvent(event);
    expect(global.spaceFn).toHaveBeenCalled();
  });
});
