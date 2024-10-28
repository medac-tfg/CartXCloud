import { ObjectId, Schema, model } from "mongoose";

interface Ticket {
  products: { id: ObjectId; price: number; tax: number }[];
  discounts: { id: ObjectId; amount: number }[];
  state: "pending" | "paid" | "cancelled";
  createdAt: Date;
}

const ticketSchema = new Schema<Ticket>({
  products: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      tax: {
        type: Number,
        required: true,
      },
    },
  ],
  discounts: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Discount",
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
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
