const createConfigurator = require("./configurators");

global.log = () => {};

test('passes', () => {});

test('configurator gets ran', async () => {
    const configurator = createConfigurator({});

    const fn = jest.fn();
    configurator.add(fn);

    await configurator.run();

    expect(fn.mock.calls.length).toBe(1);
});

test('multiple configurators get ran', async () => {
    const configurator = createConfigurator({});

    const fn1 = jest.fn();
    const fn2 = jest.fn();
    configurator.add(fn1);
    configurator.add(fn2);

    await configurator.run();

    expect(fn1.mock.calls.length).toBe(1);
    expect(fn2.mock.calls.length).toBe(1);
});

test('configurator gets ran', async () => {
    const container = Symbol();
    const configurator = createConfigurator(container);

    const fn = jest.fn();
    configurator.add(fn);

    await configurator.run();
    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(container);
});
