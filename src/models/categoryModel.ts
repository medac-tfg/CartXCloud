import { Schema, model } from "mongoose";

interface Category {
  name: string;
  image: string;
  createdAt: Date;
}

const categorySchema = new Schema<Category>({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = model("Category", categorySchema);
export default Category;
