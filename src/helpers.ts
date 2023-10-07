import { ModuleKey } from "./types";

export function moduleKeyToString(key: ModuleKey<unknown>): string {
  if (["string", "number", "boolean", "bigint"].includes(typeof key)) {
    return key.toString();
  }
  if (typeof key === "symbol") {
    return key.description || key.toString();
  }
  if (typeof key === "function") {
    if (key.name) {
      return `${key.name}`;
    }
  }

  return `${key}`;
}
