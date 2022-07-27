import { Collection, InsertOneResult, ObjectID, ObjectId } from "mongodb";
import { Product, ProductSchema } from "./product.entity";

export class ProductService {
  productsCollection: Collection<ProductSchema>;

  constructor(params: { productsCollection: Collection<ProductSchema> }) {
    this.productsCollection = params.productsCollection;
  }

  async createProduct(product: Product): Promise<ObjectId> {
    const productResult: InsertOneResult<ProductSchema> =
      await this.productsCollection.insertOne(product);
    return productResult.insertedId;
  }

  async getAllProducts(): Promise<ProductSchema[]> {
    const findResult: ProductSchema[] = await this.productsCollection
      .find()
      .toArray();
    return findResult;
  }

  async getProductById(id: string): Promise<ProductSchema | null> {
    const findResult: ProductSchema | null =
      await this.productsCollection.findOne({ _id: new ObjectId(id) });
    return findResult;
  }
}
