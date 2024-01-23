import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: false },
  description: { type: String, required: false },
  price: {
    type: Number,
    min: [0, "wrong min price"],
    max: [10000, "wrong ,max price"],
  },
  discountPercentage: {
    type: Number,
    min: [1, "wrong min discount"],
    max: [99, "wrong ,max discount"],
  },
  rating: {
    type: Number,
    min: [0, "wrong min rating"],
    max: [5, "wrong ,max rating"],
    default: 0,
  },
  stock: { type: Number, min: [0, "wrong min stock"], default: 0 },
  brand: { type: String, required: false },
  category: { type: String, required: false },
  thumbnail: { type: String, required: false },
  images: { type: [String], required: false },
});
const Product = mongoose.model("Product", productSchema);

export default Product;
