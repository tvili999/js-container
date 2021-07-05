const createEntries = require("./entries");

global.log = () => {};

test('passes', () => {});

test('cannot add two loaders with the same name', async () => {
    const entries = createEntries({});
    entries.add('entry', () => {});

    expect(() => {
        entries.add('entry', () => {});
    }).toThrow();
})

test('load value on first get', async () => {
    const entries = createEntries({});

    const symbol = Symbol()

    entries.add('entry', () => symbol);

    expect(await entries.get('entry')).toBe(symbol);
})
test('loader gets container as first parameter', async () => {
    const container = Symbol()

    const entries = createEntries(container);

    const fn = jest.fn();
    entries.add('entry', fn);

    await entries.get('entry');
    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(container);
})

test('load value with async loader', async () => {
    const entries = createEntries({});

    const symbol = Symbol()

    entries.add('entry', async () => symbol);

    expect(await entries.get('entry')).toBe(symbol);
})

test('load the same value on second get', async () => {
    const entries = createEntries({});

    let symbol = null;
    entries.add('entry', () => {
        if(!symbol)
            symbol = Symbol();
        
        return symbol;
    });

    expect(await entries.get('entry')).toBe(symbol);
    expect(await entries.get('entry')).toBe(symbol);
})

test('loader gets called only once', async () => {
    const entries = createEntries({});

    const symbol = Symbol()

    const loader = jest.fn(() => symbol);
    entries.add('entry', loader);

    await entries.get('entry');
    await entries.get('entry');

    expect(loader.mock.calls.length).toBe(1);
})

test('cannot add two loaders even when one of them is already loaded', async () => {
    const entries = createEntries({});
    entries.add('entry', () => {});

    await entries.get('entry');

    expect(() => {
        entries.add('entry', () => {});
    }).toThrow();
})

test('cannot add two loaders even when one of them is already loaded', async () => {
    const entries = createEntries({});

    await expect(entries.get('entry'))
        .rejects
        .toBeTruthy();
})

test('circular dependency detection', async () => {
    const entries = createEntries({});
    entries.add('entry', async () => {
        await entries.get('entry');
    });

    await expect(entries.get('entry'))
        .rejects
        .toBeTruthy();
})

