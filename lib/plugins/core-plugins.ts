import { App } from "../types/app.type";

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
