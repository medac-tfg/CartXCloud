import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";

interface SoldProduct {
  productId: ObjectId;
  rfid: string;
  soldAt: Date;
}

const soldProductSchema = new Schema<SoldProduct>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  rfid: {
    type: String,
    required: true,
  },
  soldAt: {
    type: Date,
    default: Date.now,
  },
});

const SoldProduct = model("SoldProduct", soldProductSchema);
export default SoldProduct;
