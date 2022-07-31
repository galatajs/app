import { App } from "./app.type";
import { ConstructorType } from "./util.type";

export interface Module {
  name: string;
  dependencies: Map<string, Module>;
  exports: Map<string, ModuleProvider>;
  installed: boolean;
  install: (app: App, modules: Map<string, Module>) => void | Promise<void>;
}

export type ModuleProviderFunction = (params: ModuleProviderParams) => any;
export type ModuleProviderClass = ConstructorType<any, any>;
export type ModuleProviderObject<T> = {
  name: string;
  value: T;
};

export type ModuleRegisterer = {
  key: string;
  install?: () => void;
};

export type ModuleProvider =
  | ModuleProviderFunction
  | ModuleProviderClass
  | ModuleProviderObject<any>;

export type ModuleParams = {
  imports?: Array<Module | ModuleRegisterer>;
  providers?: Array<ModuleProvider>;
  exports?: Array<ModuleProvider>;
};

export type ModuleProviderParams = {
  [key: string]: any;
};

export type ModuleCreator = (name: string, params?: ModuleParams) => Module;

export function isModule(module: any): module is Module {
  return module && module.name && module.dependencies && module.exports;
}
