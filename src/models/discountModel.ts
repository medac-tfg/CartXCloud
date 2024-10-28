import { Schema, model } from "mongoose";

interface Discount {
  name: string;
  amount: number;
  createdAt: Date;
}

const discountSchema = new Schema<Discount>({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Discount = model("Discount", discountSchema);
export default Discount;
