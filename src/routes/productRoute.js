import { createProduct, deleteProduct, getAllProducts, getProductById, updateProductById} from "../controller/productController.js";
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express();
import multer from "multer";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });

router.post("/createProduct", upload.fields([{ name: 'images', maxCount: 4 }, { name: 'thumbnail', maxCount: 1 }]),createProduct);

router.get("/getAllProducts",getAllProducts)

router.get("/getProductById/:id",getProductById)

router.delete("/deleteProduct/:id",deleteProduct)

router.put("/updateProductById/:id",updateProductById)




export default router;
