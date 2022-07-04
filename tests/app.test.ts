import { createApp } from "../lib";

it("create app", () => {
  const app = createApp();
  expect(app.version).toBe(global.__VERSION__);
  expect(app.config.production).toBe(false);
});
