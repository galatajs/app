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

  it("create a module with async onModuleInstalled listener", async () => {
    let res = 0;
    let date = new Date().getTime();
    class Provider {
      async onModuleInstalled() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            res = 1;
            resolve();
          }, 1200);
        });
      }
    }
    const secondProvider = () => {
      this.onModuleInstalled = () => {
        date = new Date().getTime() - date;
      };
    };
    const module = createModule("test", {
      providers: [Provider],
    });
    const mainModule = createModule("main", {
      imports: [module],
      providers: [secondProvider],
    });
    const app = createApp(mainModule);
    await app.start();
    assert.strictEqual(module.installed, true);
    assert.strictEqual(res, 1);
    assert.strictEqual(date > 1000, true);
  });

  it("create a module with use onAppStarted event in provider", async () => {
    let res = 1;
    class Provider {
      onAppStarted() {
        res = 3;
      }
    }
    const module = createModule("test", {
      providers: [Provider],
    });
    const app = createApp(module);
    await app.start();
    assert.strictEqual(res, 3);
  });
});
