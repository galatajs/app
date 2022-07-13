import { App } from "../types/app.type";

export type CorePluginCreator = {
  build(): CorePlugin;
};

export interface CorePlugin {
  name: string;
  version: string;
  install: (app: App, ...options: any[]) => void | Promise<void>;
  onAppStarted(hook: (app: App) => void): void;
}

export type CreateCorePluginParams = {
  name: string;
  version: string;
  install: (app: App, ...options: any[]) => void;
};
