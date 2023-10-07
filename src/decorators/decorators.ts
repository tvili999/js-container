import { ModuleKey } from "../index";
import { ContainerMetadata } from "./metadata";

function getMetadataObject() {}

export function Inject<T>(moduleKey: ModuleKey<T>) {
  return function (ctx: any, name: string) {
    const metadata = ContainerMetadata.getMetadata(ctx.constructor);

    metadata.injections.push({ name, key: moduleKey });
  };
}

export function Build() {
  return function (ctx: any, name: string) {
    const metadata = ContainerMetadata.getMetadata(ctx.constructor);

    metadata.buildMethods.push(async (obj) => {
      await obj[name]();
    });
  };
}

export function Init() {
  return function (ctx: any, name: string) {
    const metadata = ContainerMetadata.getMetadata(ctx.constructor);

    metadata.initMethods.push(async (obj) => {
      await obj[name]();
    });
  };
}

export function Run() {
  return function (ctx: any, name: string) {
    const metadata = ContainerMetadata.getMetadata(ctx.constructor);

    metadata.runMethods.push(async (obj) => {
      await obj[name]();
    });
  };
}
