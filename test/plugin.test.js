const { describe, it } = require("node:test");
const assert = require("node:assert");
const { createPlugin, createCorePlugin } = require("../dist");

describe("Plugin Unit Testing", () => {
  it("create a plugin", () => {
    const plugin = createPlugin({
      name: "test",
      multiple: true,
      install: (app) => {},
    });
    assert.strictEqual(plugin.name, "test");
    assert.strictEqual(plugin.multiple, true);
    assert.notStrictEqual(plugin.install, undefined);
  });

  it("create a core plugin", () => {
    const plugin = createCorePlugin({
      name: "test",
      version: "1.0.0",
      install: (app) => {},
    });
    assert.strictEqual(plugin.name, "test");
    assert.strictEqual(plugin.version, "1.0.0");
    assert.notStrictEqual(plugin.install, undefined);
  });
});
