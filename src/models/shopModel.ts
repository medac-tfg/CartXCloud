import { ObjectId, Schema, model } from "mongoose";

interface Shop {
  name: string;
  productList: ObjectId[];
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Shop = model("Shop", shopSchema);
export default Shop;
