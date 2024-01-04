import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: false,
    enum: ["admin", "user"],
    default: "user",
  },
});

const Role = mongoose.model("Role", roleSchema);
export default Role;
