const { describe, it } = require("node:test");
const assert = require("node:assert");
const { createModule } = require("../dist");

describe("Module testing", () => {
  it("createModule should return a Module", () => {
    const module = createModule("test");
    assert.strictEqual("name" in module, true);
  });

  it("create child module and add to parent dependency", () => {
    const childModule = createModule("child");
    const rootModule = createModule("module", {
      imports: [childModule],
    });
    assert.strictEqual(rootModule.dependencies.size, 1);
    assert.strictEqual(rootModule.dependencies.get("child"), childModule);
  });

  it("create one child modules, add to two parent dependency and check install count", () => {
    const subModule = createModule("subModule");
    const childModule = createModule("child");
    const rootModule = createModule("module", {
      imports: [childModule],
    });
    childModule.dependencies.set("subModule", subModule);
    const rootModule2 = createModule("module2", {
      imports: [childModule],
    });
    assert.strictEqual(rootModule.dependencies.size, 1);
    assert.strictEqual(rootModule2.dependencies.size, 1);
    assert.strictEqual(rootModule.dependencies.get("child"), childModule);
    assert.strictEqual(rootModule2.dependencies.get("child"), childModule);
    assert.strictEqual(subModule.installed, false);
  });

  it("create product module with providers and check install count", () => {
    const productModule = createModule("product", {
      providers: [{ name: "test", value: "test" }],
    });
    assert.strictEqual(productModule.installed, false);
  });
});
