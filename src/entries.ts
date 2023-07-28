import { Container, Injector, ModuleKey } from "./types.js"

export default class Entries {
    private loaders: Map<ModuleKey<unknown>, Injector<unknown>> = new Map()
    private entries: Map<ModuleKey<unknown>, unknown> = new Map()
    private loadQueue: ModuleKey<unknown>[] = []

    private notifiers: Map<ModuleKey<unknown>, Function[]> = new Map()

    constructor(private container: Container) { }

    add<T = unknown>(name: ModuleKey<T>, loader: Injector<T>) {
        if(this.loaders.has(name) || this.entries.has(name))
            throw `Module '${name.toString()}' is already injected`;

        this.loaders.set(name, loader)
    }

    async get<T = unknown>(key: ModuleKey<T>): Promise<T> {
        if(this.entries.has(key))
            return this.entries.get(key) as T;

        if(!this.loaders.has(key))
            throw `No entry '${key.toString()}' in container`;

        // if(this.loadQueue[this.loadQueue.length - 1] === key) {
        //     return await new Promise(resolve => {
        //         const wrapper = (value: T) => {
        //             const currentNotifiers = this.notifiers.get(key) || []
        //             this.notifiers.set(key, currentNotifiers.filter(x => x !== wrapper))
        //             resolve(value);
        //         }

        //         const currentNotifiers = this.notifiers.get(key) || []
        //         this.notifiers.set(key, [...currentNotifiers, wrapper])
        //     });
        // }

        if(this.loadQueue.includes(key))
            throw `Circular module dependency: ${this.loadQueue.join(" -> ")} -> ${key}`;

        this.container.log(`Load module: ${key.toString()}`);

        this.loadQueue = [...this.loadQueue, key];
        this.entries.set(key, await Promise.resolve(this.loaders.get(key)?.(this.container)));
        this.loadQueue = this.loadQueue.filter(x => x !== key);

        const currentNotifiers = this.notifiers.get(key) || []
        for(const handler of currentNotifiers)
            handler(this.entries.get(key));

        return this.entries.get(key) as T;
    }
}
