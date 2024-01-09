import {
  createRole,
  deleteRoleById,
  getRoleById,
  updateRoleById,
} from "../controller/adminController.js";
import express from "express";
//   import { verifyToken } from "../middleware/verifyToken.js";
const router = express();

router.post("/createRole", createRole);
router.get("/getRollById/:roleId", getRoleById);
router.put("/updateRollById/:roleId", updateRoleById);
router.delete("/deleteRollById/:roleId", deleteRoleById);


export default router;
