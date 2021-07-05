const container = require("./index");

test('passes', () => { });

test('Mock works', async () => {
    const randomObject = {"random": "fullyrandom"};
    const randomObject2 = {"random": "anotherfullyrandom"};
    const componentName = "test";

    const component = await container.testContext(componentName, container => 
        container.inject(componentName, () => randomObject)
    );

    expect(component).toEqual(randomObject);
    expect(component).not.toEqual(randomObject2);
});