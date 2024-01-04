import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: false,

  },
  email: {
    type: String,
    required: false,

  },
  password: {
    type: String,
    required: false,
  },
  confirmPassword: {
    type: String,
    required: false,
  },
  phone: {
    type: Number,
    required: false,
  },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: false },
});

const User = mongoose.model("User", userSchema);
export default User;
