const createContainer = require("./index");

test('test', () => {});

test('create error after initialization', () => {
    const container = createContainer();

    expect(() => {
        container.inject(() => {});
    }).toThrow();

    expect(() => {
        container.configure(() => {});
    }).toThrow();

    expect(() => {
        container.run(() => {});
    }).toThrow();
})
