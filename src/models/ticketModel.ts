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
  quantity: {
    type: Number,
    required: true,
  },
});

const additionalProductSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
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
  quantity: {
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
  products: {
    id: ObjectId;
    name: string;
    description: string;
    brand: string;
    image: string;
    priceNoVat: number;
    tax: number;
    weight: number;
    quantity: number;
  }[];
  additionalProducts: {
    _id: ObjectId;
    name: string;
    image: string;
    priceNoVat: number;
    tax: number;
    quantity: number;
  }[];
  discounts: { id: ObjectId; amount: number }[];
  state: "pending" | "paid" | "cancelled";
  shoppingMethod: string;
  cart: ObjectId;
  createdAt: Date;
}

const ticketSchema = new Schema<Ticket>({
  products: {
    type: [productSchema],
    default: [],
  },
  additionalProducts: {
    type: [additionalProductSchema],
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
  shoppingMethod: {
    type: String,
    required: true,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Ticket = model("Ticket", ticketSchema);
export default Ticket;
