
export interface InjectionKey<T> extends Symbol {}
export type RunnerKey = string | Symbol

export type ModuleKey<T> = string | InjectionKey<T>

export interface Dependency {
    dependsOn?: string | string[],
    dependentBy?: string | string[]
}

export type Injector<T> = (container: Container) => Promise<T> | T
export type Runner = (container: Container) => Promise<void> | void

export type Configurator = (container: Container) => Container

export interface Container {
    log: Function,
    get<T = unknown>(name: ModuleKey<T>): Promise<T>,
    logger(logger: Function): Container,
    inject<T = unknown>(name: ModuleKey<T>, injector: Injector<T>): Container,
    configure(...configurator: Configurator[]): Container,
    dependency(name: RunnerKey, dependency: Dependency): Container,
    init(runner: Runner): Container,
    run(name: RunnerKey, runner: Runner): Container,
    run(runner: Runner): Container,
}
