import { createModule } from "../lib";

describe("Module testing", () => {
  it("createModule should return a Module", () => {
    const module = createModule("test");
    expect("name" in module).toBe(true);
  });

  it("create child module and add to parent dependency", () => {
    const childModule = createModule("child");
    const rootModule = createModule("module", {
      imports: [childModule],
    });
    expect(rootModule.dependencies.size).toBe(1);
    expect(rootModule.dependencies.get("child")).toBe(childModule);
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
    expect(rootModule.dependencies.size).toBe(1);
    expect(rootModule2.dependencies.size).toBe(1);
    expect(rootModule.dependencies.get("child")).toBe(childModule);
    expect(rootModule2.dependencies.get("child")).toBe(childModule);
    expect(subModule.installed).toBe(false);
  });

  it("create product module with providers and check install count", () => {
    const productModule = createModule("product", {
      providers: [{ name: "test", value: "test" }],
    });
    expect(productModule.installed).toBe(false);
  });
});
