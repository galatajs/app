import { App } from "../types/app.type";

export type CorePluginCreator = {
  build(): CorePlugin;
};

export interface CorePlugin {
  name: string;
  version: string;
  forceWait?: boolean;
  install: (
    app: App,
    corePlugins: Map<string, CorePlugin>
  ) => void | Promise<void>;
}

export type CreateCorePluginParams = {
  name: string;
  version: string;
  forceWait?: boolean;
  install: (app: App, corePlugins: Map<string, CorePlugin>) => void;
};
