import {
  deleteUser,
  getAllUser,
    getUserId,
    login,
    updateUserById,
    userRegister,
  } from "../controller/userController.js";
  import express from "express";
//   import { verifyToken } from "../middleware/verifyToken.js";
  const router = express();
  
  router.post("/register", userRegister);
  router.get("/getAllUser", getAllUser);
  router.get("/getUserId/:id", getUserId);
  router.put("/updateUserId/:id", updateUserById);
  router.delete("/deleteUser", deleteUser);
  router.post("/login", login);
  
 
  export default router;
  