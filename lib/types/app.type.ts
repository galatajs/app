import { AppConfig } from "../config";
import { CorePlugin, CorePluginCreator, Plugin } from "../plugins";
import { Module } from "../modules";

export interface App<T extends AppConfig = AppConfig> {
  version: string;
  config: T;
  module?: Module;
  use(plugin: Plugin, ...options: any[]): this;
  register(plugin: CorePlugin | CorePluginCreator, ...options: any[]): this;
  start(): void;
}
