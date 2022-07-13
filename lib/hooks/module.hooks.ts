import {
  Module,
  ModuleCreator,
  ModuleParams,
  ModuleProvider,
  ModuleProviderParams,
} from "../types/module.type";
import { App } from "../types/app.type";
import { appStartedEvent } from "../events/app.events";
import { Util } from "../util/Util";
import { isConstructor } from "../types/util.type";

export const createModule: ModuleCreator = (
  name: string,
  params: ModuleParams = {}
): Module => {
  const _dependencies = new Map<string, Module>();
  const providers = new Map<string, ModuleProvider>();
  const exports: string[] = [];
  params.imports?.forEach((dependency) => {
    _dependencies.set(Util.toCamelCase(dependency.name), dependency);
  });
  params.providers?.forEach((provider) => {
    providers.set(Util.toCamelCase(provider.name), provider);
  });
  params.exports?.forEach((exportKey) => {
    exports.push(Util.toCamelCase(exportKey.name));
  });
  return {
    name: name,
    dependencies: _dependencies,
    exports: new Map<string, any>(),
    installed: false,
    onAppStarted: (hook: (app: App) => void) => {
      appStartedEvent.addListener(hook);
    },
    install(app: App, modules: Map<string, Module>) {
      if (!this.installed) {
        this.installed = true;
        const _providers: ModuleProviderParams = {};
        this.dependencies.forEach((dependency) => {
          for (const [key, value] of dependency.exports.entries()) {
            _providers[Util.toCamelCase(key)] = value;
          }
        });
        for (const [key, creator] of providers.entries()) {
          let _key = key;
          let _value;
          if (typeof creator === "object") {
            _value = creator.value;
            _key = creator.name;
          } else if (isConstructor(creator)) {
            _value = new creator(_providers);
          } else {
            _value = creator(_providers);
          }
          _key = Util.toCamelCase(_key);
          _providers[_key] = _value;
          if (exports.includes(_key)) {
            this.exports.set(_key, _value);
          }
        }
        name = Util.toCamelCase(name);
        if (!modules.has(name)) {
          modules.set(name, this);
        }
      }
      for (const dependency of this.dependencies.values()) {
        dependency.install(app, modules);
      }
    },
  };
};
