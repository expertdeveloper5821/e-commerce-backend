import {
    createAdmin,
 
  } from "../controller/adminController.js";
  import express from "express";
//   import { verifyToken } from "../middleware/verifyToken.js";
  const router = express();
  
  router.post("/createAdmin", createAdmin);
  
 
  export default router;
  