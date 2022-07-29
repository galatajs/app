const { describe, it } = require("node:test");
const assert = require("node:assert");
const { createApp, createModule } = require("../dist");

describe("App & Module integrated testing", () => {
  it("create a module and install it", async () => {
    const module = createModule("test");
    const app = createApp(module);
    assert.strictEqual(module.installed, false);
    await app.start();
    assert.strictEqual(module.installed, true);
  });

  it("create product module with providers and create category module with dependency and check install count", async () => {
    const productModule = createModule("product", {
      providers: [{ name: "test", value: "test" }],
    });
    const categoryModule = createModule("category", {
      imports: [productModule],
    });
    const app = createApp(categoryModule);
    assert.strictEqual(productModule.installed, false);
    assert.strictEqual(categoryModule.installed, false);
    await app.start();
    assert.strictEqual(productModule.installed, true);
    assert.strictEqual(categoryModule.installed, true);
  });

  it("create product module with providers and create category module with dependency and check dependency params is getting", () => {
    const test = { name: "test", value: "test" };
    const productModule = createModule("product", {
      providers: [test],
      exports: [test],
    });
    const createCategoryService = (params) => {
      assert.strictEqual(params.test, "test");
    };
    const categoryModule = createModule("category", {
      imports: [productModule],
      providers: [createCategoryService],
    });
    const baseModule = createModule("base", {
      imports: [productModule, categoryModule],
    });
    const app = createApp(baseModule);
    app.start();
  });

  it("create product module with class service and create category module with dependency and check dependency params is getting", () => {
    class ProductService {
      constructor() {}

      test = () => {
        return "test";
      };
    }
    const productModule = createModule("product", {
      providers: [ProductService],
      exports: [ProductService],
    });
    const createCategoryService = ({ productService }) => {
      assert.strictEqual(productService.test(), "test");
    };
    const categoryModule = createModule("category", {
      imports: [productModule],
      providers: [createCategoryService],
    });
    const baseModule = createModule("base", {
      imports: [productModule, categoryModule],
    });
    const app = createApp(baseModule);
    app.start();
  });

  it("create product module with module registerer", async () => {
    let count = 0;
    const registerer = () => {
      return {
        key: "test",
        install() {
          count++;
        },
      };
    };
    const productModule = createModule("product", {
      imports: [registerer()],
    });
    const app = createApp(productModule);
    await app.start();
    assert.strictEqual(count, 1);
  });
});
