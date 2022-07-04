import { App } from "../types/app.type";

export interface Plugin {
  name: string;
  multiple: boolean;
  install(app: App, ...options: any[]): void;
  onAppStarted: (hook: (app: App) => void) => void;
}

export type CreatePluginParams = {
  name: string;
  multiple?: boolean;
  install(app: App, ...options: any[]): void;
};
