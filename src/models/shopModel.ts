import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";

interface Shop {
  name: string;
  productList: ObjectId[];
  additionalProductList: ObjectId[];
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
    type: [Schema.Types.ObjectId],
    ref: "AdditionalProduct",
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Shop = model("Shop", shopSchema);
export default Shop;
