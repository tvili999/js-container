const parseArgs = require("./parseArgs");

const createMockingContext = (containerName) => {
    if(!global.containerMocker)
        global.containerMocker = {};

    if(!global.containerMocker[containerName])
        global.containerMocker[containerName] = {
            loaders: {},
            runners: [],
            configurations: []
        }
    return global.containerMocker[containerName];
}

module.exports = {};

module.exports.mockLoader = (...args) => {
    let [ containerName, name, loader ] = parseArgs('default', null, null)(...args);

    const context = createMockingContext(containerName);

    context.loaders[name] = loader;
    return loader;
}

module.exports.mockRunner = (...args) => {
    let [ containerName, name, runner ] = parseArgs('default', null, null)(...args);

    const context = createMockingContext(containerName);

    context.runners.push([name, runner].filter(x => x));
}

module.exports.mockConfiguration = (...args) => {
    let [ containerName, configuration ] = parseArgs('default', null)(...args);

    const context = createMockingContext(containerName);

    context.configurations.push(configuration);
}
