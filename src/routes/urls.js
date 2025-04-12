const express = require("express");
const authenticationRoutes = require("./auth");
const productController = require("../controllers/productController"); // Import product controller

const router = express.Router();

router.use("/auth", authenticationRoutes);
router.post("/products", productController.createProduct);
router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;
