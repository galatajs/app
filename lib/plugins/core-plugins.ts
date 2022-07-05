import { App } from "../types/app.type";

export type CorePluginCreator = {
  build(): CorePlugin;
};

export function isPluginCreator(plugin: any): plugin is CorePluginCreator {
  return typeof plugin.build === "function";
}

export interface CorePlugin {
  name: string;
  version: string;
  install: (app: App, ...options: any[]) => void;
  onAppStarted(hook: (app: App) => void): void;
}

export type CreateCorePluginParams = {
  name: string;
  version: string;
  install: (app: App, ...options: any[]) => void;
};
