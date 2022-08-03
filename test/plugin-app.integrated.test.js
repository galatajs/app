const { describe, it } = require("node:test");
const assert = require("node:assert");
const { createPlugin, createCorePlugin, createApp } = require("../dist");

describe("App & Plugin integrated testing", () => {
  it("create a plugin and install it", () => {
    let installed = false;
    const plugin = createPlugin({
      name: "test",
      multiple: true,
      install(app, ...options) {
        installed = true;
      },
    });
    const app = createApp();
    app.use(plugin);
    assert.strictEqual(installed, true);
  });

  it("create a core plugin and install it", async () => {
    let installed = false;
    const plugin = createCorePlugin({
      name: "test",
      version: "1.0.0",
      install(app, ...options) {
        installed = true;
      },
    });
    const app = createApp();
    app.register(plugin);
    assert.strictEqual(installed, false);
    await app.start();
    assert.strictEqual(installed, true);
  });

  it("create a async module and try install", async () => {
    let time = new Date().getTime();
    let finishTime = 0;
    const app = createApp();
    const plugin = createCorePlugin({
      name: "test-time",
      version: "1.0.0",
      install: async (app, ...options) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            finishTime = new Date().getTime();
            resolve();
          }, 120);
        });
      },
    });
    app.register(plugin);
    await app.start();
    assert.strictEqual(finishTime - time > 100, true);
    assert.strictEqual(finishTime > 100, true);
    assert.strictEqual(time === 0, false);
    assert.strictEqual(finishTime === 0, false);
  });

  it("create a async core plugin with force wait", async () => {
    let lastCalled = "";
    const plugin = createCorePlugin({
      name: "test-sync",
      version: "1.0.0",
      forceWait: true,
      async install(app, ...options) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            lastCalled = "async";
            resolve();
          }, 1000);
        });
      },
    });
    const plugin2 = createCorePlugin({
      name: "test2",
      version: "1.0.0",
      install(app, ...options) {
        lastCalled = "sync";
      },
    });
    const app = createApp();
    app.register(plugin);
    app.register(plugin2);
    await app.start();
    assert.strictEqual(lastCalled, "sync");
  });

  it("create app with onAppStarted hook", async () => {
    let res = 1;
    class MyPlugin {
      name = "my-plugin";
      multiple = false;

      onAppStarted() {
        res = 2;
      }
      install(app) {}
    }
    const app = createApp();
    app.use(MyPlugin);
    await app.start();
    assert.strictEqual(res, 2);
  });

  it("create a closeable core plugin and close app", async () => {
    let installed = false;
    let finished = false;
    const module1 = {
      name: "testing",
      version: "0.0.1",
      close() {
        finished = true;
      },
      install() {
        installed = true;
      },
    };
    const app = createApp();
    app.register(module1);
    await app.start();
    assert.strictEqual(installed, true);
    assert.strictEqual(finished, false);
    app.close();
    assert.strictEqual(finished, true);
  });
});
