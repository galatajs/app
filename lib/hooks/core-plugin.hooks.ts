import { App } from "../types/app.type";
import { CorePlugin, CreateCorePluginParams } from "../plugins";
import { appStartedEvent } from "../events/app.events";

export const createCorePlugin = (
  params: CreateCorePluginParams
): CorePlugin => {
  return {
    name: params.name,
    version: params.version,
    install: params.install,
    onAppStarted(hook: (app: App) => void) {
      appStartedEvent.addListener(hook);
    },
  };
};
