import { Product } from "./product.entity";
import { Repository } from "typeorm";

export class ProductService {
  productRepository: Repository<Product>;

  constructor(params: { productRepository: Repository<Product> }) {
    this.productRepository = params.productRepository;
  }

  async createProduct(product: Product): Promise<Product> {
    const savedProduct = this.productRepository.create({
      name: product.name,
      price: product.price,
    });
    await this.productRepository.save(savedProduct);
    return savedProduct;
  }

  async getProductById(id: number): Promise<Product | null> {
    return this.productRepository.findOneBy({ id });
  }
}
