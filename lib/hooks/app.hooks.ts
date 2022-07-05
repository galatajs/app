import { Module } from "../modules";
import { App } from "../types/app.type";
import { AppConfig } from "../config";
import {
  CorePlugin,
  CorePluginCreator,
  isPluginCreator,
  Plugin,
} from "../plugins";
import { warn } from "../warning/warning";
import { appCreatedEvent, appStartedEvent } from "../events/app.events";

const plugins = new Set<Plugin>();
const corePlugins = new Set<CorePlugin>();
const modules = new Set<string>();

export const createApp = <T extends AppConfig = AppConfig>(
  rootModule?: Module
): App<T> => {
  appCreatedEvent.publish(true);
  return {
    version: global.__VERSION__,
    module: rootModule,
    config: {
      production: global.__PROD__,
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
      if (corePlugins.has(instance)) {
        !this.config.production &&
          warn(`Plugin ${instance.name} is already registered`);
      } else {
        corePlugins.add(instance);
        instance.install(this, ...options);
      }
      return this;
    },
    start(): void {
      if (this.module) {
        this.module.install(this, modules);
      }
      !this.config.production && warn(`App is running in production mode.`);
      appStartedEvent.publish(this);
    },
  };
};
