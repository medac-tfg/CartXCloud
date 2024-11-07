import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";

const productSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
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
});

const discountSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    ref: "Discount",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

interface Ticket {
  products: { id: ObjectId; priceNoVat: number; tax: number }[];
  discounts: { id: ObjectId; amount: number }[];
  state: "pending" | "paid" | "cancelled";
  createdAt: Date;
}

const ticketSchema = new Schema<Ticket>({
  products: {
    type: [productSchema],
    default: [],
  },
  discounts: {
    type: [discountSchema],
    default: [],
  },
  state: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Ticket = model("Ticket", ticketSchema);
export default Ticket;
