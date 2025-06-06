import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";

import Category from "./categoryModel.js";

interface Product {
  _id: ObjectId;
  name: string;
  description: string;
  brand: string;
  image: string;
  priceWithTax: number;
  tax: number;
  weight: number;
  category: ObjectId;
  barcode: string;
  createdAt: Date;
}

const productSchema = new Schema<Product>({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  priceWithTax: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: Category,
  },
  barcode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = model("Product", productSchema);
export default Product;
