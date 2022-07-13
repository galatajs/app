import { App } from "./app.type";
import { ConstructorType } from "./util.type";

export interface Module {
  name: string;
  dependencies: Map<string, Module>;
  exports: Map<string, ModuleProvider>;
  installed: boolean;
  onAppStarted: (hook: (app: App) => void) => void;
  install: (app: App, modules: Map<string, Module>) => void;
}

export type ModuleProviderFunction = (params: ModuleProviderParams) => any;
export type ModuleProviderClass = ConstructorType<any, any>;
export type ModuleProviderObject<T> = {
  name: string;
  value: T;
};

export type ModuleProvider =
  | ModuleProviderFunction
  | ModuleProviderClass
  | ModuleProviderObject<any>;

export type ModuleParams = {
  imports?: Array<Module>;
  providers?: Array<ModuleProvider>;
  exports?: Array<ModuleProvider>;
};

export type ModuleProviderParams = {
  [key: string]: any;
};

export type ModuleCreator = (name: string, params?: ModuleParams) => Module;
