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
import transporter from "../middleware/emailConfig.js";
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
      return res
        .status(400)
        .json({ message: "Please enter a valid phone number" });
    }

    const findUserEmail = await User.findOne({ email });
    if (findUserEmail) {
      return res
        .status(409)
        .json({
          message: "This email is already in use, please try a different email",
        });
    }

    let userRole = await Role.findOne({ role: "user" });

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
    const token = req.header("Authorization")?.split(" ")[1];
    const decode = Jwt.verify(token, envconfig.SECRET_KEY);

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
    const existingUser = await User.findOne({ email }).populate("role");
    if (!existingUser) {
      return res.status(404).json({ message: "user not found" });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(404).json({ message: "invalid credentials" });
    }
    const token = Jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
        phone: existingUser.phone,
        fullName: existingUser.fullName,
      },
      envconfig.SECRET_KEY
    );
    let userData = {
      token: token,
    };
    return res.status(200).json({ message: "logon successfully", userData  });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

const sendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (email) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      } else {
        const genToken = Jwt.sign({ _id: user._id }, envconfig.SECRET_KEY, {
          expiresIn: "1h",
        });
        const link = `${envconfig.feRedirect}/reset-password/?token=${genToken}`;

        const sendMail = await transporter.sendMail({
          from: envconfig.EMAIL_USER,
          to: email,
          subject: "Reset Password",
          html: `Click here to reset your password <a href= ${link}>click here</a> `,
        });
        return res
          .status(200)
          .json({ message: "Email is sent, please check your email" });
      }
    }
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ message: "Error in sending email", error });
  }
};

const resetPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  try {
    const token = req.query.token;
    const decode = Jwt.verify(token, envconfig.SECRET_KEY);
    const user = await User.findById(decode._id);
    if (!newPassword) {
      return res.status(400).json({
        error: { message: "New password is required." },
      });
    }

    if (!confirmPassword) {
      return res.status(400).json({
        error: { message: "Confirm password is required." },
      });
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(500)
        .json({ message: "New password and confirm password not match." });
    } else {
      const salt = await bcrypt.genSalt(10);
      const newHashpassword = await bcrypt.hash(newPassword, salt);
      // await User.findOneAndUpdate(user._id, { $set: {password: newHashpassword} });
      user.password = newHashpassword;
      await user.save();
      return res.status(200).json({ message: "Password Reset Successfully" });
    }
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ message: "Error in reset password", error });
  }
};

const changePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User nor found" });
    }
    const isValid = await bcrypt.compare(
      currentPassword,
      existingUser.password
    );
    if (!isValid) {
      return res.status(400).json({ message: "Incorrect current password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();
    return res.status(200).json({ message: "Password changes successfully" });
  } catch (error) {
    console.error("Error in change password", error);
    return res.status(500).json({ message: "Error in change password" });
  }
};
export {
  userRegister,
  getAllUser,
  deleteUser,
  getUserId,
  updateUserById,
  login,
  sendEmail,
  resetPassword,
  changePassword,
};
