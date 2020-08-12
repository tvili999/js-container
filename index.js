const createContainer = (...configurations) => {
    let _loaders = {}

    let _loadQueue = [];
    let _eagerLoads = [];

    let _entries = {}
    let initialized = false;

    const load = (name) => {
        if(name in _entries)
            return true;

        if(!_loaders[name])
            return false;

        if(_loadQueue.includes(name))
            throw "Circular dependency in module '" + name + "': " + _loadQueue.toString();
        _loadQueue.push(name);

        if(typeof _loaders[name] === "function")
            _entries[name] = _loaders[name](container);
        else
            _entries[name] = _loaders[name];
        delete _loaders[name];

        _loadQueue.splice(_loadQueue.indexOf(name, 1));
        
        return true;
    }
    
    const container = new Proxy({}, {
        get(_, name) {
            if(!load(name))
                return undefined;
            return _entries[name];
        },
        set(_, name, value) {
            _entries[name] = value;
        }
    })

    container.inject = (loaders) => {
        if(initialized)
            throw "Already initialized";
        _loaders = {..._loaders, ...loaders};

        return container;
    }
    container.autoLoad = (...loaders) => {
        if(initialized)
            throw "Already initialized";
        _eagerLoads.push([...loaders].flat());

        return container;
    }

    container.configure = (...configurations) => {
        if(initialized)
            throw "Already initialized";
        [...configurations].forEach(configuration => configuration(container));
        return container;
    }

    container.configure(...configurations);
    _eagerLoads.forEach(x => container.configure(...x));

    initialized = true;

    return container;
}
module.exports = createContainer