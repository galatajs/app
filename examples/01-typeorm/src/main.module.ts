import { createModule, Module } from "@istanbul/app";
import { productModule } from "./product/product.module";

export const mainModule: Module = createModule("main", {
  imports: [productModule],
});
