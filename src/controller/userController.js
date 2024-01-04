import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import {
  validPhone,
  validateEmail,
  validatePass,
} from "../utils/validation.js";
import envconfig from "../config/envConfig.js";
import Role from "../models/roleModel.js";
// import transporter from "../middleware/emailConfig.js";

const userRegister = async (req, res) => {
  try {
    const { fullName, email, password, phone, confirmPassword } = req.body;

    if (!fullName || !email || !password || !phone || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const isValidPass = validatePass(password);
    if (!isValidPass) {
      return res.status(400).json({ message: "Please enter a valid password" });
    }

    const isValidPhone = validPhone(phone);
    if (!isValidPhone) {
      return res.status(400).json({ message: "Please enter a valid phone number" });
    }

    const findUserEmail = await User.findOne({ email });
    if (findUserEmail) {
      return res.status(409).json({ message: "This email is already in use, please try a different email" });
    }

    let userRole = await Role.findOne({ role: 'user' });
 

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
      phone,
      confirmPassword,
      role: userRole,
    });

    // Save the user
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


const getAllUser = async (req, res) => {
  try {
    const getUsers = await User.find({});
    if (!getUsers) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json({ message: "User found", getUsers });
    }
  } catch (error) {
    console.error("Error in get users", error);
    return res.status(500).json({ message: "Error in get users", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    const decode = Jwt.verify(token,envconfig.SECRET_KEY);

    const delUser = await User.findByIdAndDelete(decode._id);
    if (!delUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(500).json(delUser);
    }
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ message: "Error in delete users", error });
  }
};

const getUserId = async (req, res) => {
  try {
    const getUser = await User.findById(req.params.id);
    if (!getUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json({ message: "User found", getUser });
    }
  } catch {
    console.error("Error", error);
    return res.status(500).json({ message: "Error in get users", error });
  }
};

const updateUserById = async (req, res) => {
  try {
    let userId = req.params.id;
    let updatedEmail = req.body.email;
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { email: updatedEmail },
      { new: true }
    );
    if (!updateUser) {
      return res.status(404).json({ message: "User not update" });
    } else {
      return res.status(200).json({ message: "User update", updateUser });
    }
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ message: "Error in update users", error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email }).populate('role');
    if (!existingUser) {
      return res.status(404).json({ message: "user not found" });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(404).json({ message: "invalid credentials" });
    }
    const token = Jwt.sign(
      { id: existingUser._id, email: existingUser.email, role:existingUser.role, phone: existingUser.phone, fullName: existingUser.fullName },
      envconfig.SECRET_KEY
    );
    let userData = {
      token:token
    }
    const dataUser = token;
    return res.status(200).json({ message: "logon successfully", dataUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export {
  userRegister,
  getAllUser,
  deleteUser,
  getUserId,
  updateUserById,
  login
};
