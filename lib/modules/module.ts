import { App } from "../types/app.type";

export interface Module {
  name: string;
  dependencies: Array<this>;
  onAppStarted: (hook: (app: App) => void) => void;
  install: (app: App, modules: Set<string>) => void;
  installed: boolean;
}
