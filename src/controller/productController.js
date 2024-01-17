import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import Jwt from "jsonwebtoken";
import envconfig from "../config/envConfig.js";

// configuration
cloudinary.config({
    cloud_name: envconfig.CLOUD_NAME,
    api_key: envconfig.API_KEY,
    api_secret: envconfig.API_SECRET
});


// post Create Product
const createProduct = async (req, res) => {
    try {
        const { title, description, price, discountPercentage, rating, stock, brand, category} = req.body;
        const {images , thumbnail} = req.files;
        
        if (!title || !images || !description || !price || !discountPercentage || !rating || !stock || !brand || !category || !thumbnail) {
            res.status(400).json({ message: "All fields are required" });
        } else {

            
            const otherImagesUrls = await Promise.all(images.slice(1).map(async (image) => {
                const { secure_url } = await cloudinary.uploader.upload(image.path);
                return secure_url;
            }));
            
            const { secure_url:thumbnailUrl } = await cloudinary.uploader.upload(images[0].path);

            
            const product = new Product({
                title,
                description,
                price,
                discountPercentage,
                rating,
                stock,
                brand,
                category,
                thumbnail:thumbnailUrl,
                images:otherImagesUrls
            });

            const productSave = await product.save();
            if (productSave?._id) {
                return res.status(200).json({
                    _id: productSave._id,
                    images:otherImagesUrls,
                    title,
                    description,
                    discountPercentage,
                    rating,
                    stock,
                    brand,
                    category,
                    price,
                    thumbnail:thumbnailUrl
                });
            } else {
                res.status(400).json({ error: error });
            }
        }
    } catch (error) {
        console.error('Error in create product', error);
        res.status(500).json({ message: 'Error in create product' });
    }
};

// GetAllProduct

const getAllProducts = async (req, res) => {
    try {
        const allProducts = await Product.find({});

        if (!allProducts) {
            return res.status(404).json({ message: "No products found" });
        } else {
            return res.status(200).json({ message: "Products found", products: allProducts });
        }
    } catch (error) {
        console.error("Error in get products", error);
        return res.status(500).json({ message: "Error in get products", error });
    }
};

// deleteProduct

const deleteProduct = async (req, res) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        const decode = Jwt.verify(token, envconfig.SECRET_KEY);

        const productId = req.params.id;

        if (!productId) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const deletedProduct = await Product.findOneAndDelete({ _id: productId, userId: decode._id });

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found or you are not authorized to delete it" });
        }

        return res.status(200).json({ message: "Product deleted", deletedProduct });
    } catch (error) {
        console.error("Error in delete product", error);
        return res.status(500).json({ message: "Error in delete product", error });
    }
};

// getProductById

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        if (!productId) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const foundProduct = await Product.findById(productId);

        if (!foundProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product found", product: foundProduct });
    } catch (error) {
        console.error("Error in get product by ID", error);
        return res.status(500).json({ message: "Error in get product by ID", error });
    }
};

// updateProductById

const updateProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const updateFields = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        if (!updateFields || Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, updateFields, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product updated", updatedProduct });
    } catch (error) {
        console.error("Error in update product by ID", error);
        return res.status(500).json({ message: "Error in update product by ID", error });
    }
};



export {createProduct , getAllProducts , deleteProduct , getProductById , updateProductById}