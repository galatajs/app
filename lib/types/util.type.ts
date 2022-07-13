import { CorePluginCreator } from "../plugins";

export type ConstructorType<T, P = any> = new (params?: P) => T;

export function isPromise<T>(func: any): func is Promise<T> {
  return func.constructor.name === "AsyncFunction";
}

export const isConstructor = (obj: any): obj is new (...args: any[]) => any => {
  return obj.prototype && obj.prototype.constructor === obj;
};

export function isPluginCreator(plugin: any): plugin is CorePluginCreator {
  return typeof plugin.build === "function";
}
