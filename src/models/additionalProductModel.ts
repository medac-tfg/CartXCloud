import { Schema, model } from "mongoose";

interface AdditionalProduct {
  name: string;
  image: string;
  priceNoVat: number;
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
  priceNoVat: {
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

const AdditionalProduct = model("AdditionalProduct", additionalProductSchema);
export default AdditionalProduct;
