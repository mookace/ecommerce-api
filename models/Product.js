const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true, },
        category: { type: Array },
        price: { type: Number, required: true },
        color: { type: String, required: true },
        size: { type: String, required: true },
        stock: { type: Number, required: true },
        material: { type: String, required: true },
        imageUrl: { type: String, required: true },

    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);