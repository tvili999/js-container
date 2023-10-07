export interface Constructor<T> {
  new (): T;
}

interface SymbolInjectionKey<T> extends Symbol {}
interface StringInjectionKey<T> extends String {}

export type InjectionKey<T> = SymbolInjectionKey<T> | StringInjectionKey<T>;

export type RunnerKey = string | Symbol;

export type ModuleKey<T> = InjectionKey<T> | Constructor<T>;

export interface Dependency {
  dependsOn?: RunnerKey | RunnerKey[];
  dependentBy?: RunnerKey | RunnerKey[];
}

export type Injector<T> = (container: Container) => Promise<T> | T;
export type Runner = (container: Container) => Promise<void> | void;

export type Configurator = (container: Container) => Container;

export interface Container {
  log: Function;
  get<T>(name: Constructor<T>): Promise<T>;
  get<T>(name: InjectionKey<T>): Promise<T>;
  get(name: unknown): Promise<unknown>;
  logger(logger: Function): Container;
  inject<T>(name: Constructor<T>, injector: Injector<T>): Container;
  inject<T>(name: InjectionKey<T>, injector: Injector<T>): Container;
  inject(name: unknown, injector: Injector<unknown>): Container;
  configure(...configurator: Configurator[]): Container;
  dependency(name: RunnerKey, dependency: Dependency): Container;
  init(runner: Runner): Container;
  run(name: RunnerKey, runner: Runner): Container;
  run(runner: Runner): Container;
}
