const express = require("express");

const ProductController = require("../controllers/product");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, ProductController.createProduct);

router.put("/:id", checkAuth, extractFile, ProductController.updateProduct);

router.get("", ProductController.getProducts);

router.get("/:id", ProductController.getProduct);

router.delete("/:id", checkAuth, ProductController.deleteProduct);

module.exports = router;
