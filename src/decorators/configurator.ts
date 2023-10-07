import { configure, init, inject, run } from "..";
import { Configurator, Constructor } from "../types";
import { ContainerMetadata } from "./metadata";

export function toConfigurator(cls: Constructor<any>) {
  const metadata = ContainerMetadata.getMetadata(cls);

  const configurators: Configurator[] = [];

  configurators.push(
    inject(cls, async ({ get }) => {
      const obj = new cls();
      for (const injection of metadata.injections) {
        obj[injection.name] = await get(injection.key);
      }

      for (const buildMethod of metadata.buildMethods) {
        await buildMethod(obj);
      }

      return obj;
    }),
  );

  for (const initMethod of metadata.initMethods) {
    configurators.push(
      init(async ({ get }) => {
        const obj = await get(cls);
        await initMethod(obj);
      }),
    );
  }

  for (const runMethod of metadata.runMethods) {
    configurators.push(
      run(async ({ get }) => {
        const obj = await get(cls);
        await runMethod(obj);
      }),
    );
  }

  return configure(...configurators);
}
