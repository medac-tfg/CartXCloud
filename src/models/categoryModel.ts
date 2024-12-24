import { Schema, model } from "mongoose";

interface Category {
  name: string;
  icon: { lib: string; icon: string };
  color: string;
  createdAt: Date;
}

const categorySchema = new Schema<Category>({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: Object,
    required: true,
  },
  color: {
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
