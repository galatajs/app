import { createRouter, Request, Response } from "@istanbul/http";
import { ProductService } from "./product.service";
import { Product } from "./product.entity";

export const createProductController = ({
  productService,
}: {
  productService: ProductService;
}): void => {
  createRouter({ prefix: "products" })
    .post("create", async (req: Request, res: Response): Promise<any> => {
      const product = await productService.createProduct(req.body as Product);
      res.successData<Product>("Product successfully created", product);
    })
    .get(":id", async (req: Request, res: Response): Promise<any> => {
      const product = await productService.getProductById(req.params.id);
      if (product === null) return res.notFound("Product not found");
      res.successData<Product>("Product successfully fetched", product);
    });
};
