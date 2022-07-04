import { Module } from "../modules";
import { App } from "../types/app.type";
import { appStartedEvent } from "../events/app.events";

export const createModule = (
  name: string,
  dependencies: Array<Module> = []
): Module => {
  return {
    name: name,
    dependencies: dependencies,
    installed: false,
    onAppStarted: (hook: (app: App) => void) => {
      appStartedEvent.addListener(hook);
    },
    install(app: App, modules: Set<string>) {
      this.installed = true;
      if (!modules.has(name)) {
        modules.add(name);
      }
      for (const dependency of this.dependencies) {
        dependency.install(app, modules);
      }
    },
  };
};
