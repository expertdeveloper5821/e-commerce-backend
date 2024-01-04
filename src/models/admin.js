import { Admin } from "mongodb";
import mongoose from "mongoose";


const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    require: false,
    trim:true
  },
  email: {
    type: String,
    require: false,
    unique:true,
  },
  password: {
    type: String,
    require: false,
  },
  confirmPassword:{
    type:String,
    require:false,
  },
  phone:{
    type: Number,
    require: false,
  },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
});

const User = mongoose.model("Admin", adminSchema);
export default Admin;
