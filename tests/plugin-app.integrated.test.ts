import { App, CorePlugin, createApp, Plugin } from "../lib";
import { createPlugin } from "../lib/hooks/plugin.hooks";
import { createCorePlugin } from "../lib/hooks/core-plugin.hooks";

it("create a plugin and install it", () => {
  let installed = false;
  const plugin: Plugin = createPlugin({
    name: "test",
    multiple: true,
    install(app: App, ...options: any[]) {
      installed = true;
    },
  });
  const app = createApp();
  app.use(plugin);
  expect(installed).toBe(true);
});

it("create a core plugin and install it", () => {
  let installed = false;
  const plugin: CorePlugin = createCorePlugin({
    name: "test",
    version: "1.0.0",
    install(app: App, ...options: any[]) {
      installed = true;
    },
  });
  const app = createApp();
  app.register(plugin);
  expect(installed).toBe(true);
});

it("create a core plugin and start it", () => {
  let started = false;
  const plugin: CorePlugin = createCorePlugin({
    name: "test",
    version: "1.0.0",
    install(app: App, ...options: any[]) {},
  });
  plugin.onAppStarted(() => {
    started = true;
  });
  const app = createApp();
  app.register(plugin);
  app.start();
  expect(started).toBe(true);
});
