import { ReadonlyMap } from "@istanbul/core";
import { Module } from "../types/module.type";
import { App, AppCreator } from "../types/app.type";
import { AppConfig } from "../config";
import { CorePlugin, CorePluginCreator, Plugin } from "../plugins";
import { warn } from "../warning/warning";
import { appCreatedEvent, appStartedEvent } from "../events/app.events";
import { isPromise } from "util/types";
import { isPluginCreator } from "../types/util.type";

const plugins = new Set<Plugin>();
const corePlugins = new Map<string, CorePlugin>();
const modules: Map<string, Module> = new Map();

export const createApp: AppCreator = <T extends AppConfig = AppConfig>(
  rootModule?: Module
): App<T> => {
  appCreatedEvent.publish(true);
  return {
    version: __VERSION__,
    module: rootModule,
    config: {
      production: __PROD__,
    } as T,
    use(plugin: Plugin, ...options): App<T> {
      if (!plugin.multiple && plugins.has(plugin)) {
        !this.config.production &&
          warn(`Plugin ${plugin.name} is already registered`);
      } else {
        plugins.add(plugin);
        plugin.install(this, ...options);
      }
      return this;
    },
    register(plugin: CorePlugin | CorePluginCreator, ...options): App<T> {
      let instance: CorePlugin;
      if (isPluginCreator(plugin)) {
        instance = plugin.build();
      } else {
        instance = plugin;
      }
      if (corePlugins.has(instance.name)) {
        !this.config.production &&
          warn(`Plugin ${instance.name} is already registered`);
      } else {
        corePlugins.set(instance.name, instance);
      }
      return this;
    },
    async installAllModules(): Promise<void> {
      const stack: Array<Promise<any>> = [];
      for (const plugin of corePlugins.values()) {
        if (plugin.forceWait) {
          await plugin.install(this, corePlugins);
        } else {
          const install: Promise<void> | void = plugin.install(
            this,
            corePlugins
          );
          if (isPromise(install)) stack.push(install);
        }
      }
      await Promise.all(stack);
    },
    async start(): Promise<void> {
      if (this.module) this.module.install(this, modules);
      await this.installAllModules();
      appStartedEvent.publish(this);
    },
  };
};
