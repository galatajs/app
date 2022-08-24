import { Injector } from "@istanbul/inject";
import { AppConfig } from "../config";
import { CorePlugin, CorePluginCreator, Plugin } from "../plugins";
import { Module } from "./module.type";

export interface App<T extends AppConfig = AppConfig> {
  version: string;
  config: T;
  module?: Module;
  store: Injector<any>;
  use(plugin: Plugin, ...options: any[]): this;
  register(plugin: CorePlugin | CorePluginCreator, ...options: any[]): this;
  start(): Promise<void>;
  close(): void;
  enableShutdownEvents(): void;
}

export type AppCreator = <T extends AppConfig = AppConfig>(
  rootModule?: Module
) => App<T>;
