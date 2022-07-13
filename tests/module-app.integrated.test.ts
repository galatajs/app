import { createApp, createModule, Module } from "../lib";

describe("App & Module integrated testing", () => {
  it("create a module and install it", () => {
    const module: Module = createModule("test");
    const app = createApp(module);
    expect(module.installed).toBe(false);
    app.start();
    expect(module.installed).toBe(true);
  });

  it("create product module with providers and create category module with dependency and check install count", () => {
    const productModule = createModule("product", {
      providers: [{ name: "test", value: "test" }],
    });
    const categoryModule = createModule("category", {
      imports: [productModule],
    });
    const app = createApp(categoryModule);
    expect(productModule.installed).toBe(false);
    expect(categoryModule.installed).toBe(false);
    app.start();
    expect(productModule.installed).toBe(true);
    expect(categoryModule.installed).toBe(true);
  });

  it("create product module with providers and create category module with dependency and check dependency params is getting", () => {
    const test = { name: "test", value: "test" };
    const productModule = createModule("product", {
      providers: [test],
      exports: [test],
    });
    const createCategoryService = (params: any) => {
      expect(params.test).toBe("test");
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

      test = (): string => {
        return "test";
      };
    }
    const productModule = createModule("product", {
      providers: [ProductService],
      exports: [ProductService],
    });
    const createCategoryService = ({ productService }: any) => {
      expect(productService.test()).toBe("test");
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
});
