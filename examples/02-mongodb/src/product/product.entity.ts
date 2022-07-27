import { Document, ObjectId } from "mongodb";

export interface Product {
  _id?: ObjectId;
  name: string;
  price: number;
}

export interface ProductSchema extends Document, Product {}
