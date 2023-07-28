import { Configurator, Dependency, Injector, ModuleKey, Runner } from "./types.js"

export function logger(log: Function): Configurator {
    return ({logger}) => logger(log)
}

export function init(runner: Runner): Configurator {
    return ({ init }) => init(runner)
}

export function run(name: string, runner: Runner): Configurator;
export function run(runner: Runner): Configurator;
export function run(name: string | Runner, runner?: Runner): Configurator {
    return ({ run }) => run(name as any, runner as any)
}

export function inject<T = unknown>(name: ModuleKey<T>, injector: Injector<T>): Configurator {
    return ({inject}) => inject(name, injector)
}

export function configure(...configurator: Configurator[]): Configurator {
    return ({configure}) => configure(...configurator)
}

export function dependency(name: string, dependency: Dependency): Configurator {
    return ({ dependency: _dependency }) => _dependency(name, dependency)
}
