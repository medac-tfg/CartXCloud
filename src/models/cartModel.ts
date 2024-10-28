import { Schema, model } from "mongoose";

interface Cart {
  name: string;
  createdAt: Date;
}

const cartSchema = new Schema<Cart>({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = model("Cart", cartSchema);
export default Cart;
