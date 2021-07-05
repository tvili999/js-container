module.exports = (container) => {
    let _loaders = {}
    let _entries = {}
    let _loadQueue = [];

    const api = {
        add: (name, loader) => {
            if(name in _loaders || name in _entries)
                throw `Module '${name}' is already injected`;
            
            _loaders[name] = loader;
        },
        get: async (key) => {
            if(key in _entries)
                return _entries[key];
            if(!(key in _loaders))
                throw `No entry '${key}' in container`;

            if(_loadQueue.includes(key))
                 throw "Circular module dependency: " + _loadQueue.join(" -> ") + " -> " + key;

            log(`Load module: ${key}`);
            
            _loadQueue.push(key);
            _entries[key] = await Promise.resolve(_loaders[key](container));
            _loadQueue = _loadQueue.filter(x => x !== key);
            return _entries[key];
        }
    };

    return api;
}