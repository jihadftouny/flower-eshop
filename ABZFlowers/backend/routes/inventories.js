const express = require("express");
const multer = require("multer");

const Inventory = require("../models/inventory");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post("", multer({ storage: storage }).single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const inventoryItem = new Inventory({
    imagePath: url + "/images/" + req.file.filename,
    content: req.body.content,
    title: req.body.title,
    quantity: req.body.quantity,
    currency: req.body.currency,
    price: req.body.price,
    itemName: req.body.itemName,
  });
  inventoryItem.save().then((createdItem) => {
    res.status(201).json({
      message: "Inventory item added successfully",
      inventoryItem: {
        ...createdItem.toObject(),
        id: createdItem._id,
      },
    });
  });
});

router.put("/:id", multer({ storage: storage }).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const inventoryItem = new Inventory({
    _id: req.params.id,
    imagePath: imagePath,
    content: req.body.content,
    title: req.body.title,
    quantity: req.body.quantity,
    currency: req.body.currency,
    price: req.body.price,
    itemName: req.body.itemName,
  });
  Inventory.updateOne({ _id: req.params.id }, inventoryItem).then((result) => {
    res.status(200).json({ message: "Update successful!" });
  });
});

router.get("", (req, res, next) => {
  Inventory.find().then((documents) => {
    res.status(200).json({
      message: "Inventory items fetched successfully!",
      inventoryItems: documents,
    });
  });
});

router.get("/:id", (req, res, next) => {
  Inventory.findById(req.params.id).then((inventoryItem) => {
    if (inventoryItem) {
      res.status(200).json(inventoryItem);
    } else {
      res.status(404).json({ message: "Inventory item not found!" });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Inventory.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
  });
  res.status(200).json({ message: "Inventory item deleted!" });
});

module.exports = router;
