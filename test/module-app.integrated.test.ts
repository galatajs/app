import {
  createApp,
  createModule,
  Module,
  ModuleRegisterer,
  OnModuleInstalled,
} from "../lib";

describe("App & Module integrated testing", () => {
  it("create a module and install it", async () => {
    const module: Module = createModule("test");
    const app = createApp(module);
    expect(module.installed).toBe(false);
    await app.start();
    expect(module.installed).toBe(true);
  });

  it("create product module with providers and create category module with dependency and check install count", async () => {
    const productModule = createModule("product", {
      providers: [{ name: "test", value: "test" }],
    });
    const categoryModule = createModule("category", {
      imports: [productModule],
    });
    const app = createApp(categoryModule);
    expect(productModule.installed).toBe(false);
    expect(categoryModule.installed).toBe(false);
    await app.start();
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

  it("create product module with module registerer", async () => {
    let count: number = 0;
    const registerer = (): ModuleRegisterer => {
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
    expect(count).toBe(1);
  });

  it("create a module with providers and check providers this keyword is binding status", async () => {
    let text = "";
    class Test {
      test = "test";
    }
    class TestService implements OnModuleInstalled {
      private test: Test;
      constructor(params: { test: Test }) {
        this.test = params.test;
      }

      onModuleInstalled() {
        text = this.getTest().test;
      }

      getTest() {
        return this.test;
      }
    }
    const testModule = createModule("test", {
      providers: [Test, TestService],
    });
    const app = createApp(testModule);
    await app.start();
    expect(text).toBe("test");
  });
});
