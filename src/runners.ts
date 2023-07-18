import { Container, Dependency, Runner, RunnerKey } from "./types.js";

function wrapInArray<T>(value?: T | T[]): T[] {
    if(!value)
        return [];

    if(Array.isArray(value)) {
        return value as T[]
    }

    return [value as T]
}

export default class Runners {
    private runners: Map<RunnerKey, Runner> = new Map();
    private runQueue: RunnerKey[] = [];
    private ran: RunnerKey[] = [];

    private dependencies: Map<RunnerKey, RunnerKey[]> = new Map();

    constructor(private container: Container) { }


    add(name: string, runner: Runner): void;
    add(runner: Runner): void;
    add(nameOrRunner: string | Runner, runner?: Runner): void {
        let name : string | Symbol;
        if(runner) {
            name = nameOrRunner as string
        }
        else {
            runner = nameOrRunner as Runner;
            name = Symbol("anonymous")
        }

        if(this.runners.has(name))
            throw `Runner '${name.toString()}' already exists`;

        this.runners.set(name, runner)
    }

    dependency(name: string, dependency: Dependency) {
        let dependsOn = wrapInArray(dependency.dependsOn)
        let dependentBy: string[] = wrapInArray(dependency.dependentBy)

        for(const dependency of dependsOn) {
            if(!this.dependencies.has(name))
                this.dependencies.set(name, []);

            this.dependencies.get(name)?.push(dependency);
        }
        for(const dependency of dependentBy) {
            if(!this.dependencies.has(dependency))
                this.dependencies.set(dependency, []);

            this.dependencies.get(dependency)?.push(name);
        }
    }

    async run(name: RunnerKey) {
        const runner = this.runners.get(name) as Runner;
        if(!runner)
            throw `Runner '${name.toString()}' does not exist`;
        if(this.ran.includes(name))
            return;

        if(this.runQueue.includes(name))
            throw `Circular runner dependency: ${this.runQueue.join(" -> ")} -> ${name.toString()}`;
        this.runQueue.push(name);

        const displayName = typeof name === "symbol" ? (name as Symbol).description : name
        this.container.log(`Run: ${displayName}`);

        if(this.dependencies.has(name))
            for(const dependency of this.dependencies.get(name) || [])
                await this.run(dependency);

        await Promise.resolve(runner(this.container));

        this.ran.push(name);
        this.runQueue = this.runQueue.filter(x => x !== name);
    }

    async runAll() {
        for(const name of this.runners.keys())
            await this.run(name)
    }
}
