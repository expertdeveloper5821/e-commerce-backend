import {
    createRole, getRoleById,
 
  } from "../controller/adminController.js";
  import express from "express";
//   import { verifyToken } from "../middleware/verifyToken.js";
  const router = express();
  
  router.post("/createRole", createRole);
  router.get("/getRollById/:id",getRoleById);
  
 
  export default router;
  