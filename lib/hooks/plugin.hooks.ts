import { CreatePluginParams, Plugin } from "../plugins";

export const createPlugin = (params: CreatePluginParams): Plugin => {
  return {
    name: params.name,
    multiple: params.multiple || false,
    install: params.install,
  };
};
