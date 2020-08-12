function randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < length; i++ )
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    return result;
};

const promisize = (value) => {
    if (typeof value?.then === "function")
        return value;
    if(typeof value === "function")
        return async (...args) => value(...args);
    else 
        return async () => value;
}

const createDependencyGroup = (name, ...dependencies) => container => (container
    .inject(name, async () => {
        let dependents = [];
        let onFinish = [];
        let waiting = false;

        return {
            join() {
                if(waiting) 
                    return new Promise(resolve => onFinish.push(resolve));

                waiting = true;
                return new Promise(resolve => {
                    let deps = dependents;
                    dependents = null;

                    if(deps.length === 0)
                        resolve();
                    else
                        onFinish.push(resolve);
                })
            },
            createDependency(name) {
                if(waiting)
                    throw "Already waiting";

                dependents.push(name);
            },
            finishDependency(name) {
                dependents = dependents.filter(x => x !== name);
                if(waiting && dependents.length == 0)
                    onFinish.forEach(x=>x());
            }
    }
    })
    .run(name, async ({dependsOn, get}) => {
        await dependsOn(...dependencies);
        const target = await get(name);
        await target.join();
    })
)


const createContainer = async (...configurations) => {
    let _loaders = {}

    let _loadQueue = [];
    let _runners = {};

    let _entries = {}
    let initialized = false;
    
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
            for(config of configurations)
                config(container);
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
        dependencyGroup(name) {
            return createDependencyGroup(name)(container);
        }
    }

    container.configure(...configurations);

    initialized = true;

    let _runQueue = [];
    let _ran = [];

    const doRunner = async (name, runner) => {
        if(_ran.includes(name))
            return;

        if(_runQueue.includes(name))
            throw "Circular runner dependency: " + _runQueue.join(" -> ") + " -> " + name;
        _runQueue.push(name);

        await runner({
            ...container,
            dependsOn: async (...names) => {
                for(const name of names) {
                    if(!(name in _runners))
                        throw `Dependency '${name}' of runner ${name} does not exist.`
                    await doRunner(name, _runners[name]);
                }
            }
        });

        _ran.push(name);
        _runQueue = _runQueue.filter(x => x !== name);
    }

    for(runnerName in _runners) 
        await doRunner(runnerName, _runners[runnerName]);
    
    _runners = null;
    _ran = null;
    _runQueue = null;

    return container;
}

module.exports = createContainer;