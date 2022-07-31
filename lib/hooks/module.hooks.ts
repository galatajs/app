import {
  isModule,
  Module,
  ModuleCreator,
  ModuleParams,
  ModuleProvider,
  ModuleProviderParams,
  ModuleRegisterer,
} from "../types/module.type";
import { App } from "../types/app.type";
import { appFinishedEvent, appStartedEvent } from "../events/app.events";
import { Util } from "../util/Util";
import { isConstructor } from "../types/util.type";
import {
  isOnAppFinished,
  isOnAppStarted,
  isOnModuleInstalled,
} from "../events/module.events";

export const createModule: ModuleCreator = (
  name: string,
  params: ModuleParams = {}
): Module => {
  const _dependencies = new Map<string, Module>();
  const registers = new Map<string, ModuleRegisterer>();
  const providers = new Map<string, ModuleProvider>();
  const exports: string[] = [];
  params.imports?.forEach((dependency) => {
    if (isModule(dependency)) {
      _dependencies.set(Util.toCamelCase(dependency.name), dependency);
    } else {
      registers.set(dependency.key, dependency);
    }
  });
  params.providers?.forEach((provider) => {
    providers.set(Util.toCamelCase(provider.name), provider);
  });
  params.exports?.forEach((exportKey) => {
    exports.push(Util.toCamelCase(exportKey.name));
  });

  const installAllRegisters = () => {
    registers.forEach((register) => {
      if (register.install) register.install();
    });
  };

  const checkEvents = async (
    module: any,
    providers: ModuleProviderParams
  ): Promise<void> => {
    if (isOnModuleInstalled(module)) {
      await module.onModuleInstalled(providers);
    }
    if (isOnAppStarted(module)) {
      appStartedEvent.addListener(module.onAppStarted);
    }
    if (isOnAppFinished(module)) {
      appFinishedEvent.addListener(module.onAppFinished);
    }
  };

  return {
    name: name,
    dependencies: _dependencies,
    exports: new Map<string, any>(),
    installed: false,
    async install(app: App, modules: Map<string, Module>) {
      installAllRegisters();
      if (!this.installed) {
        this.installed = true;
        const _providers: ModuleProviderParams = {};
        this.dependencies.forEach((dependency) => {
          for (const [key, value] of dependency.exports.entries()) {
            _providers[Util.toCamelCase(key)] = value;
          }
        });
        for (const key of registers.keys()) {
          const injected = app.store.inject(key, true);
          if (injected) {
            _providers[Util.toCamelCase(key)] = injected;
          }
        }
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
          await checkEvents(_value, _providers);
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
        await dependency.install(app, modules);
      }
    },
  };
};
