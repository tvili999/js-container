import createContainer, { InjectionKey, inject } from "../..";
import { Constructor } from "../../types";
import { toConfigurator } from "../configurator";
import { Build, Inject, Run } from "../decorators";

class Module {
  @Inject("testA")
  private testA!: string;

  @Inject("testB")
  private testB!: string;

  private id: number = 0;

  @Build()
  private async build() {
    console.log("build", this.id++);
  }

  @Run()
  private async run() {
    console.log("run", this.id++);
  }

  @Run()
  private async init() {
    console.log("init", this.id++);
  }

  public asd() {
    return "asd";
  }
}

class SomeOtherClass {
  dik() {}
}

it("test", async () => {
  const container = await createContainer(
    inject("testA", () => "Test A"),
    inject("testB", () => "Test B"),
    toConfigurator(Module),
  );

  const key: InjectionKey<SomeOtherClass> = Symbol("asdasd");
  const asd = await container.get(key);
  asd.dik();

  const module = await container.get(Module);
  console.log(module.asd());
});
