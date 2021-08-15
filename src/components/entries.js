module.exports = (container) => {
    let _loaders = {}
    let _entries = {}
    let _loadQueue = [];

    let __notifiers = {};

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

            if(_loadQueue[_loadQueue.length - 1] === key) {
                return await new Promise(resolve => {
                    const wrapper = (...args) => {
                        __notifiers[key] = __notifiers[key].filter(x => x !== wrapper);
                        resolve(...args);
                    }

                    __notifiers[key] = [...(__notifiers[key] || []), wrapper];
                });
            }

            if(_loadQueue.includes(key))
                 throw "Circular module dependency: " + _loadQueue.join(" -> ") + " -> " + key;

            log(`Load module: ${key}`);
            
            _loadQueue = [..._loadQueue, key];
            _entries[key] = await Promise.resolve(_loaders[key](container));
            _loadQueue = _loadQueue.filter(x => x !== key);
            for(const handler of (__notifiers[key] || []))
                handler(_entries[key]);
            return _entries[key];
        }
    };

    return api;
}