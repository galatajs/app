import { createModule } from "@istanbul/app";
import { registerCollection } from "@istanbul/mongodb";
import { createProductController } from "./product.controller";
import { ProductService } from "./product.service";

export const productModule = createModule("product", {
  imports: [registerCollection("products")],
  providers: [ProductService, createProductController],
});
