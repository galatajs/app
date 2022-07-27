import { createRouter, Request, Response } from "@istanbul/http";
import { ProductService } from "./product.service";
import { Product } from "./product.entity";
import { ObjectId } from "mongodb";

export const createProductController = ({
  productService,
}: {
  productService: ProductService;
}): void => {
  createRouter({ prefix: "products" })
    .post("create", async (req: Request, res: Response): Promise<any> => {
      const productId: ObjectId = await productService.createProduct(
        req.body as Product
      );
      res.successData<ObjectId>("Product successfully created", productId);
    })
    .get("all", async (req: Request, res: Response): Promise<any> => {
      const products = await productService.getAllProducts();
      res.successData<Product[]>("Products successfully fetched", products);
    })
    .get(":id", async (req: Request, res: Response): Promise<any> => {
      const product = await productService.getProductById(req.params.id);
      if (product === null) return res.notFound("Product not found");
      res.successData<Product>("Product successfully fetched", product);
    });
};
