const randomString = function(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < length; i++ )
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    return result;
};

module.exports = (container) => {
    let _runners = {};
    let _runQueue = [];
    let _ran = [];

    let _dependencies = {};

    const api = {
        add: (name, runner) => {
            if(_runners[name])
                throw `Runner '${name}' already exists`;

            if(!runner) {
                runner = name;
                do {
                    name = randomString(15);
                } while(name in _runners)
            }

            _runners[name] = runner;
        },
        dependency: (name, { dependsOn, dependentBy }) => {
            if(dependsOn && !Array.isArray(dependsOn))
                dependsOn = [dependsOn];
            if(dependentBy && !Array.isArray(dependentBy))
                dependentBy = [dependentBy];
            
            for(const dependency of dependsOn || []) {
                if(!_dependencies[name])
                    _dependencies[name] = [];

                _dependencies[name].push(dependency);
            }
            for(const dependency of dependentBy || []) {
                if(!_dependencies[dependency])
                    _dependencies[dependency] = [];

                _dependencies[dependency].push(name);
            }
        },
        run: async (name) => {
            const runner = _runners[name];
            if(!runner)
                throw `Runner '${name}' does not exist`;
            if(_ran.includes(name))
                return;
    
            if(_runQueue.includes(name))
                throw "Circular runner dependency: " + _runQueue.join(" -> ") + " -> " + name;
            _runQueue.push(name);
    
            log(`Run: ${name}`);
            
            if(_dependencies[name])
                for(const dependency of _dependencies[name])
                    await api.run(dependency);

            await Promise.resolve(runner(container));
    
            _ran.push(name);
            _runQueue = _runQueue.filter(x => x !== name);
        },
        runAll: async () => {
            for(const name in _runners)
                await api.run(name)
        }
    };

    return api;
}