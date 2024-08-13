const Product = require("../models/Product");
const mongoose = require("mongoose");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//Create Product
router.post("/", verifyTokenAndAdmin, async (req, res) => {

    // for image validation
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "Must Attach a file" });
    }
    let files = req.files;
    console.log(files);

    if (files.img.truncated === true) {
        return res.status(400).json({
            message: "File too large"
        });
    }
    if (
        !(
            files.img.mimetype == "image/png" ||
            files.img.mimetype == "image/jpeg"
        )
    ) {
        return res.status(400).json({
            message: "Only png and jpeg is allowed"
        });
    }

    files.img.name = `${Date.now()}-${files.img.name}`;
    let filepath = `${appRoot}/uploads/${files.img.name}`;
    console.log(filepath);
    files.img.mv(filepath, function (err) {
        if (err) return res.status(500).send(err);
        console.log("File uploaded!");
    });
    let newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        color: req.body.color,
        size: req.body.size,
        stock: req.body.stock,
        material: req.body.material,
        imageUrl: files.img.name
    })
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

//UPDATE Products
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    // for image validation
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "Must Attach a file" });
    }
    let files = req.files;
    console.log(files);

    if (files.img.truncated === true) {
        return res.status(400).json({
            message: "File too large"
        });
    }
    if (
        !(
            files.img.mimetype == "image/png" ||
            files.img.mimetype == "image/jpeg"
        )
    ) {
        return res.status(400).json({
            message: "Only png and jpeg is allowed"
        });
    }

    files.img.name = `${Date.now()}-${files.img.name}`;
    let filepath = `${appRoot}/uploads/${files.img.name}`;
    console.log(filepath);
    files.img.mv(filepath, function (err) {
        if (err) return res.status(500).send(err);
        console.log("File uploaded!");
    });

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
                imageUrl: files.img.name

            },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});



//Delete Products

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been successfully deleted...")

    } catch (err) {
        res.status(500).json(err);
    }
});

//Get Products

router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});
//Get All

router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (qCategory) {
            products = await Product.find({
                category: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find();
        }



        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});






module.exports = router;