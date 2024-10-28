import { ObjectId, Schema, model } from "mongoose";

interface ScannedProduct {
  productId: ObjectId;
  rfid: string;
  scannedAt: Date;
}

const scannedProductSchema = new Schema<ScannedProduct>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  rfid: {
    type: String,
    required: true,
  },
  scannedAt: {
    type: Date,
    default: Date.now,
  },
});

const ScannedProduct = model("ScannedProduct", scannedProductSchema);
export default ScannedProduct;
