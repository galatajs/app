import { createModule } from "@istanbul/app";
import { registerEntity } from "@istanbul/typeorm";
import { createProductController } from "./product.controller";
import { Product } from "./product.entity";
import { ProductService } from "./product.service";

export const productModule = createModule("product", {
  imports: [registerEntity("productRepository", Product)],
  providers: [ProductService, createProductController],
});
