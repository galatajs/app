import { createInjector } from "@galatajs/inject";
import { Module } from "../types/module.type";
import { App, AppCreator } from "../types/app.type";
import { AppConfig } from "../config";
import { CorePlugin, CorePluginCreator, isCloseable, Plugin } from "../plugins";
import { warn } from "../warning/warning";
import {
  appCreatedEvent,
  appFinishedEvent,
  appStartedEvent,
} from "../events/app.events";
import { isPromise } from "util/types";
import { isConstructor, isPluginCreator } from "../types/util.type";
import { listenPlatformEvents } from "./events.hooks";
import { isOnAppStarted } from "../events/module.events";

const plugins = new Set<Plugin>();
const corePlugins = new Map<string, CorePlugin>();
const lastCorePlugins = new Map<string, CorePlugin>();
const modules: Map<string, Module> = new Map();

export const createApp: AppCreator = <T extends AppConfig = AppConfig>(
  rootModule?: Module
): App<T> => {
  appCreatedEvent.publish(true);

  const installCorePlugins = async (
    corePlugins: Map<string, CorePlugin>,
    instance: App
  ): Promise<void> => {
    const stack: Array<Promise<any>> = [];
    for (const plugin of corePlugins.values()) {
      if (plugin.forceWait) {
        await plugin.install(instance, corePlugins, modules);
      } else {
        const install: Promise<void> | void = plugin.install(
          instance,
          corePlugins,
          modules
        );
        if (isPromise(install)) stack.push(install);
      }
    }
    await Promise.all(stack);
  };

  return {
    version: __VERSION__,
    module: rootModule,
    config: {
      production: __PROD__,
    } as T,
    store: createInjector<any>(),
    use(plugin: Plugin, ...options): App<T> {
      if (isConstructor(plugin)) {
        plugin = new plugin();
      }
      if (!plugin.multiple && plugins.has(plugin)) {
        !this.config.production &&
          warn(`Plugin ${plugin.name} is already registered`);
      } else {
        plugins.add(plugin);
        plugin.install(this, ...options);
        if (isOnAppStarted(plugin)) {
          appStartedEvent.addListener(plugin.onAppStarted);
        }
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
        if (instance.loadLast) {
          lastCorePlugins.set(instance.name, instance);
        } else {
          corePlugins.set(instance.name, instance);
        }
        if (isCloseable(instance)) {
          appFinishedEvent.addListener(instance.close);
        }
      }
      return this;
    },
    async start(): Promise<void> {
      await installCorePlugins(corePlugins, this);
      if (this.module) await this.module.install(this, modules);
      await installCorePlugins(lastCorePlugins, this);
      appStartedEvent.publish(this);
    },
    close(): void {
      appFinishedEvent.publish("");
    },
    enableShutdownEvents() {
      listenPlatformEvents(corePlugins);
    },
    onStarted(hook: () => void) {
      appStartedEvent.addListener(hook);
    },
  };
};
