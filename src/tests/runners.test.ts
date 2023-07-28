import { ContainerImpl } from "../createContainer";
import Runners from "../runners";

test('cannot add two runners with the same name', () => {
    const runner = new Runners(new ContainerImpl());

    runner.add("entry", () => {});
    expect(() => {
        runner.add("entry", () => {});
    }).toThrow();
})

test('runner runs', async () => {
    const runner = new Runners(new ContainerImpl());

    const testRunner = jest.fn();

    runner.add('runner', testRunner);

    await runner.run('runner');
    expect(testRunner.mock.calls.length).toBe(1);
})

test('runner gets container as parameter', async () => {
    const container = new ContainerImpl();

    const runner = new Runners(container);

    const fn = jest.fn();
    runner.add('runner', fn);

    await runner.run('runner');
    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(container);
})

test('async runner runs', async () => {
    const runner = new Runners(new ContainerImpl());

    const testRunner = jest.fn();
    runner.add('runner', async () => testRunner());

    await runner.run('runner');
    expect(testRunner.mock.calls.length).toBe(1);
})

test('non existing runner throws error', async () => {
    const runner = new Runners(new ContainerImpl());

    expect(runner.run('runner'))
        .rejects
        .toBeTruthy();
})

test('runner runs only once', async () => {
    const runner = new Runners(new ContainerImpl());

    const testRunner = jest.fn();

    runner.add('runner', testRunner);

    await runner.run('runner');
    await runner.run('runner');
    expect(testRunner.mock.calls.length).toBe(1);
})

test('dependsOn dependency', async () => {
    const runner = new Runners(new ContainerImpl());

    const testRunner1 = jest.fn();
    const testRunner2 = jest.fn();

    runner.add('runner1', testRunner1);
    runner.add('runner2', testRunner2);
    runner.dependency('runner2', {
        dependsOn: ['runner1']
    })

    await runner.run('runner2');

    expect(testRunner1.mock.calls.length).toBe(1);
    expect(testRunner2.mock.calls.length).toBe(1);
})

test('dependentBy dependency', async () => {
    const runner = new Runners(new ContainerImpl());

    const testRunner1 = jest.fn();
    const testRunner2 = jest.fn();

    runner.add('runner1', testRunner1);
    runner.add('runner2', testRunner2);
    runner.dependency('runner1', {
        dependentBy: ['runner2']
    })

    await runner.run('runner2');

    expect(testRunner1.mock.calls.length).toBe(1);
    expect(testRunner2.mock.calls.length).toBe(1);
})

test('circular dependency detection', async () => {
    const runner = new Runners(new ContainerImpl());

    runner.add('runner1', () => {});
    runner.add('runner2', () => {});
    runner.dependency('runner1', {
        dependentBy: ['runner2']
    })
    runner.dependency('runner1', {
        dependsOn: ['runner2']
    })

    expect(runner.run('runner2'))
        .rejects
        .toBeTruthy();
})

test('runner running all runners', async () => {
    const runner = new Runners(new ContainerImpl());

    const testRunner1 = jest.fn();
    const testRunner2 = jest.fn();

    runner.add('runner1', testRunner1);
    runner.add('runner2', testRunner2);

    await runner.runAll();

    expect(testRunner1.mock.calls.length).toBe(1);
    expect(testRunner2.mock.calls.length).toBe(1);
})

test('runner gets added with generated name', async () => {
    const runner = new Runners(new ContainerImpl());

    const testRunner = jest.fn();

    runner.add(testRunner);

    await runner.runAll();

    expect(testRunner.mock.calls.length).toBe(1);
})
