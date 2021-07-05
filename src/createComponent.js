const createRunner = require("./components/runners");
const createEntries = require("./components/entries");
const createConfigurators = require("./components/configurators");

module.exports = async (...configurations) => {
    let initialized = false;

    const container = {};

    const _runner = createRunner(container);
    const _entries = createEntries(container);
    const _configurators = createConfigurators(container);

    const createFn = fn => (...args) => {
        if(initialized)
            throw "You cannot configure container after initialization";
        fn(...args);
        return container;
    }
    const containerName = "default";

    Object.assign(container, {
        name: name => containerName = name,
        get: name => (global?.containerMocker?.[containerName]?.loaders?.[name]) || _entries.get(name),
        inject: createFn(_entries.add),
        configure: createFn(_configurators.add),
        dependency: createFn(_runner.dependency),
        run: createFn(_runner.add)
    });

    if(global?.containerMocker?.[containerName]?.runners)
        for(const runner of global.containerMocker[containerName].runners)
            _runner.add(...runner);

    if(global?.containerMocker?.[containerName]?.configurations)
        for(const configuration of global.containerMocker[containerName].configurations)
            _configurators.add(configuration);
    
    _configurators.add(...configurations);
    await _configurators.run();

    initialized = true;

    await _runner.runAll();

    return container;
}
