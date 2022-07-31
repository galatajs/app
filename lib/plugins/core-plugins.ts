import { App } from "../types/app.type";

export type CorePluginCreator = {
  build(): CorePlugin;
};

export type OnStartedListener = (
  plugin: CorePlugin,
  providers?: Map<string, any>
) => void;

export interface CorePlugin {
  name: string;
  version: string;
  forceWait?: boolean;
  install: (
    app: App,
    corePlugins: Map<string, CorePlugin>
  ) => void | Promise<void>;
  onStarted?: (hook: OnStartedListener) => void;
}

export type CreateCorePluginParams = {
  name: string;
  version: string;
  forceWait?: boolean;
  install: (app: App, corePlugins: Map<string, CorePlugin>) => void;
};
