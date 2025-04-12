const Product = require("../models/productModel");
const Joi = require("joi");

// Validation Schema
const productSchema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().min(0).required(),
    category: Joi.string().required(),
    image: Joi.string().uri().optional()
});

// SQL Queries (Using Sequelize)
const SQL_QUERIES = {
    createProduct: async (data) => await Product.create(data),
    getProducts: async () => await Product.findAll(),
    getProductById: async (id) => await Product.findByPk(id),
    updateProduct: async (id, data) => await Product.update(data, { where: { id } }),
    deleteProduct: async (id) => await Product.destroy({ where: { id } }),
};

// Create a new product
exports.createProduct = async (req, res) => {
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const product = await SQL_QUERIES.createProduct(req.body);
        res.status(201).json({ message: "Product added successfully!", product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await SQL_QUERIES.getProducts();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await SQL_QUERIES.getProductById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const [updated] = await SQL_QUERIES.updateProduct(id, req.body);
        if (!updated) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ message: "Product updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const deleted = await SQL_QUERIES.deleteProduct(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ message: "Product deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
