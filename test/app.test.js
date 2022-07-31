const { describe, it } = require("node:test");
const assert = require("node:assert");
const { createApp } = require("../dist");

describe("App Unit Testing", () => {
  it("create app", () => {
    const app = createApp();
    assert.strictEqual(app.version, global.__VERSION__);
    assert.strictEqual(app.config.production, false);
  });
});
