import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";

interface Cart {
  name: string;
  shop: ObjectId;
  createdAt: Date;
}

const cartSchema = new Schema<Cart>({
  name: {
    type: String,
    required: true,
  },
  shop: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = model("Cart", cartSchema);
export default Cart;
