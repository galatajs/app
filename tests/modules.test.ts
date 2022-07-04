import { createModule } from "../lib";

it("createModule should return a Module", () => {
  const module = createModule("test");
  expect("name" in module).toBe(true);
});

it("create child module and add to parent dependency", () => {
  const childModule = createModule("child");
  const rootModule = createModule("module", [childModule]);
  expect(rootModule.dependencies.length).toBe(1);
  expect(rootModule.dependencies[0]).toBe(childModule);
});

it("create one child modules, add to two parent dependency and check install count", () => {
  const subModule = createModule("subModule");
  const childModule = createModule("child");
  const rootModule = createModule("module", [childModule]);
  childModule.dependencies.push(subModule);
  const rootModule2 = createModule("module2", [childModule]);
  expect(rootModule.dependencies.length).toBe(1);
  expect(rootModule2.dependencies.length).toBe(1);
  expect(rootModule.dependencies[0]).toBe(childModule);
  expect(rootModule2.dependencies[0]).toBe(childModule);
  expect(subModule.installed).toBe(false);
});
