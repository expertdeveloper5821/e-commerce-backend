import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";


const createAdmin = async (req, res) => {
  try {
    const { fullName, email, password, phone, confirmPassword } = req.body;
    if (!fullName || !email || !password || !phone || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required" });
    }

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    let userRole = await Role.findOne({ role: "admin" });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      phone,
      confirmPassword,
      password: hashPassword,
      role: userRole,
    });

    const savedUser = await newUser.save();

    if (savedUser) {
      return res.status(201).json({ message: "User registered successfully" });
    } else {
      return res.status(500).json({ message: "User not registered" });
    }
  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({ message: "Error in user registration" });
  }
};
//   create role

const createRole = async (req, res) => {
  try {
    const { role } = req.body;

    const existingRole = await Role.findOne({ role });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const newRole = new Role({ role });
    const savedRole = await newRole.save();

    return res.status(201).json(savedRole);
  } catch (error) {
    console.error("Error in creating role:", error);
    return res.status(500).json({ message: "Error in creating role" });
  }
};

const getRoleById = async (req, res) => {
  try {
    const roleId = req.params.roleId;

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    const role = await Role.findById(roleId);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.status(200).json(role);
  } catch (error) {
    console.error("Error in getting role by ID:", error);
    return res.status(500).json({ message: "Error in getting role by ID" });
  }
};

const updateRoleById = async (req, res) => {
  try {
    const roleId = req.params.roleId;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    const existingRole = await Role.findById(roleId);

    if (!existingRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (role !== existingRole.role) {
      const roleExists = await Role.findOne({ role });
      if (roleExists) {
        return res.status(400).json({ message: "Role already exists" });
      }
    }

    existingRole.role = role;
    const updatedRole = await existingRole.save();

    return res.status(200).json(updatedRole);
  } catch (error) {
    console.error("Error in updating role by ID:", error);
    return res.status(500).json({ message: "Error in updating role by ID" });
  }
};

const deleteRoleById = async (req, res) => {
  try {
    const roleId = req.params.roleId;

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    const existingRole = await Role.findById(roleId);

    if (!existingRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    await existingRole.remove();

    return res.status(204).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error in deleting role by ID:", error);
    return res.status(500).json({ message: "Error in deleting role by ID" });
  }
};



export { createAdmin, createRole, getRoleById, updateRoleById, deleteRoleById };
