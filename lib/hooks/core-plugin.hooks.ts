import { CorePlugin, CreateCorePluginParams } from "../plugins";

export const createCorePlugin = (
  params: CreateCorePluginParams
): CorePlugin => {
  return {
    name: params.name,
    version: params.version,
    install: params.install,
    forceWait: params.forceWait,
  };
};
