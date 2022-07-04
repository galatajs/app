import { App } from "../types/app.type";
import { CreatePluginParams, Plugin } from "../plugins";
import { appStartedEvent } from "../events/app.events";

export const createPlugin = (params: CreatePluginParams): Plugin => {
  return {
    name: params.name,
    multiple: params.multiple || false,
    install: params.install,
    onAppStarted: (hook: (app: App) => void) => {
      appStartedEvent.addListener(hook);
    },
  };
};
