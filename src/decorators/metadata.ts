import { ModuleKey } from "../index";

export interface Injection {
  name: string;
  key: ModuleKey<unknown>;
}

export type MethodCaller = (obj: any) => Promise<void>;

export class ContainerMetadata {
  injections: Injection[] = [];
  buildMethods: MethodCaller[] = [];
  initMethods: MethodCaller[] = [];
  runMethods: MethodCaller[] = [];

  static getMetadata(cls: any): ContainerMetadata {
    cls.__containerMetadata ||= new ContainerMetadata();

    return cls.__containerMetadata;
  }
}
