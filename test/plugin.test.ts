import { App, CorePlugin, Plugin } from "../lib";
import { createPlugin } from "../lib/hooks/plugin.hooks";
import { createCorePlugin } from "../lib/hooks/core-plugin.hooks";

describe("Plugin unit testing", () => {
  it("create a plugin", () => {
    const plugin: Plugin = createPlugin({
      name: "test",
      multiple: true,
      install: (app: App) => {},
    });
    expect(plugin.name).toBe("test");
    expect(plugin.multiple).toBe(true);
    expect(plugin.install).toBeDefined();
  });

  it("create a core plugin", () => {
    const plugin: CorePlugin = createCorePlugin({
      name: "test",
      version: "1.0.0",
      install(app: App, ...options: any[]) {},
    });
    expect(plugin.name).toBe("test");
    expect(plugin.version).toBe("1.0.0");
    expect(plugin.install).toBeDefined();
  });
});
