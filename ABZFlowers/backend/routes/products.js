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

router.get('/search', (req, res, next) => {
  const searchTerm = req.query.search;

  Product.find({ title: { $regex: searchTerm, $options: 'i' } })
    .then(products => {
      res.status(200).json({
        message: 'Search results fetched successfully',
        products: products
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching search results failed!'
      });
    });
});

module.exports = router;
