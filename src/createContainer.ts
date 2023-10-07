import {
  Configurator,
  Container,
  Dependency,
  Injector,
  ModuleKey,
  Runner,
  RunnerKey,
} from "./types.js";

import Runners from "./runners.js";
import Entries from "./entries.js";
import Configurators from "./configurators.js";

export class ContainerImpl implements Container {
  private initialized = false;

  private initRunner: Runners;
  private runner: Runners;
  private entries: Entries;
  private configurators: Configurators;

  public log: Function = () => {};

  constructor() {
    this.initRunner = new Runners(this);
    this.runner = new Runners(this);
    this.entries = new Entries(this);
    this.configurators = new Configurators(this);
  }

  private checkInit() {
    if (this.initialized)
      throw "You cannot configure container after initialization";
  }

  logger = (logger: Function): Container => {
    this.log = logger;
    return this;
  };

  get = <T>(name: ModuleKey<T>): Promise<T> => {
    return this.entries.get(name);
  };

  inject = <T = unknown>(
    name: ModuleKey<T>,
    injector: Injector<T>,
  ): Container => {
    this.checkInit();
    this.entries.add(name, injector);
    return this;
  };

  configure = (...configurator: Configurator[]): Container => {
    this.checkInit();
    this.configurators.add(...configurator);
    return this;
  };

  dependency = (name: string, dependency: Dependency): Container => {
    this.checkInit();
    this.runner.dependency(name, dependency);
    return this;
  };

  init = (runner: Runner): Container => {
    this.checkInit();
    this.initRunner.add(runner);
    return this;
  };

  run = (name: RunnerKey | Runner, runner?: Runner): Container => {
    this.checkInit();
    this.runner.add(name as any, runner as any);
    return this;
  };

  async start(...configurators: Configurator[]) {
    this.configurators.add(...configurators);
    await this.configurators.run();

    this.initialized = true;

    await this.initRunner.runAll();
    await this.runner.runAll();
  }
}

export default async (...configurations: Configurator[]) => {
  const container = new ContainerImpl();

  await container.start(...configurations);

  return container as Container;
};
