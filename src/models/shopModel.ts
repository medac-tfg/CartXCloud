import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";

interface AdditionalProduct {
  _id: ObjectId;
  name: string;
  image: string;
  priceWithTax: number;
  tax: number;
  createdAt: Date;
}

const additionalProductSchema = new Schema<AdditionalProduct>({
  name: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

interface Shop {
  name: string;
  productList: ObjectId[];
  additionalProductList: AdditionalProduct[];
  cartAdminPin: string;
  createdAt: Date;
}

const shopSchema = new Schema<Shop>({
  name: {
    type: String,
    required: true,
  },
  productList: {
    type: [Schema.Types.ObjectId],
    ref: "Product",
    default: [],
  },
  additionalProductList: {
    type: [additionalProductSchema],
    default: [],
  },
  cartAdminPin: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Shop = model("Shop", shopSchema);
export default Shop;
