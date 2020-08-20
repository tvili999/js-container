const { randomString, promisize } = require("./helpers");

const createContainer = async (...configurations) => {
    let _loaders = {}

    let _loadQueue = [];
    let _runners = {};

    let _entries = {}
    let initialized = false;
    let _dependencies = {};

    let _configurations = [];

    const container = {
        async get(key) {
            if(key in _entries)
                return _entries[key];
            if(!(key in _loaders)) 
                throw `No entry '${key}' in container`;

            if(_loadQueue.includes(key))
                throw "Circular module dependency: " + _loadQueue.join(" -> ") + " -> " + key;
            _loadQueue.push(key);
            _entries[key] = await _loaders[key](container);
            _loadQueue = _loadQueue.filter(x => x !== key);
            return _entries[key];
        },
        inject(name, loader) {
            if(initialized)
                throw "You cannot configure container after initialization";
            if(name in _loaders || name in _entries)
                throw `Module '${name}' is already injected`;
            
            _loaders[name] = promisize(loader);

            return container;
        },
        configure(...configurations) {
            if(initialized)
                throw "You cannot configure container after initialization";
            _configurations.push(...configurations)
            return container;
        },
        run(name, runner) {
            if(initialized)
                throw "You cannot configure container after initialization";

            if(!runner) {
                runner = name;
                do {
                    name = randomString(15);
                } while(name in _runners)
            }

            _runners[name] = promisize(runner);
            return container;
        },
        dependency(group, runner) {
            if(!(group in _dependencies))
                _dependencies[group] = [];
            _dependencies[group].push(runner);

            return container;
        },
        dependencyGroup(group) {
            return container.run(group, () => {});
        }
    }

    container.configure(...configurations);
    while(_configurations.length > 0) {
        const config = _configurations.pop();
        await Promise.resolve(config(container));
    }

    initialized = true;

    let _runQueue = [];
    let _ran = [];

    const doRunner = async (name) => {
        const runner = _runners[name];
        if(!runner)
            throw `Runner '${name}' does not exist`;
        if(_ran.includes(name))
            return;

        if(_runQueue.includes(name))
            throw "Circular runner dependency: " + _runQueue.join(" -> ") + " -> " + name;
        _runQueue.push(name);

        if(name in _dependencies) 
            for(const dep of _dependencies[name])
                await doRunner(dep);
        
        await runner(container);

        _ran.push(name);
        _runQueue = _runQueue.filter(x => x !== name);
    }

    for(const name in _runners)
        await doRunner(name)

    return container;
}

module.exports = createContainer;