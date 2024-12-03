import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";

interface Product {
  _id: ObjectId;
  name: string;
  description: string;
  image: string;
  priceNoVat: number;
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
  image: {
    type: String,
    required: true,
  },
  priceNoVat: {
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
    ref: "Category",
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
