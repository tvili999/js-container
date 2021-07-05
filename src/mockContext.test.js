const createContainer = require("./index");

test('test', () => {});

test('mock runner', async () => {
    const fn = jest.fn();
    createContainer.mockRunner(fn);

    await createContainer();

    expect(fn.mock.calls.length).toBe(1);
})

test('mock configuration', async () => {
    const fn = jest.fn();
    createContainer.mockConfiguration(container => container.run(fn));

    await createContainer();

    expect(fn.mock.calls.length).toBe(1);
})

test('mock loaders', async () => {
    const originalSymbol = Symbol();
    const container = await createContainer(
        ({ inject }) => inject("entry", () => originalSymbol)
    );

    expect(await container.get("entry")).toBe(originalSymbol);

    const newSymbol = Symbol();
    createContainer.mockLoader("entry", newSymbol);
    expect(await container.get("entry")).toBe(newSymbol);
})
