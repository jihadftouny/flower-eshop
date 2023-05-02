const express = require("express");
const multer = require("multer");

const Inventory = require("../models/inventory")

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //cb is callback
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('invalid mime type')
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images"); //this path is relative to the server.js file
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + '.' + ext);
  }
});

//multer will try to extract a single image
router.post("", multer({ storage: storage }).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  //you're calling this from the models folder product.js, you gave its name as'Inventory'
  const inventory = new Inventory({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
  }); //this object is being managed by mongoose, you can save the objects created here directly on monngoDB
  inventory.save().then(createdProduct => {
    res.status(201).json({
      message: "Product added succesfully",
      product: {
        ...createdProduct, //created properties with all the properties of createdProduct
        id: createdProduct._id //override to _id property
      }
    });
  }); //mongoose function, will create a collection called the same name as the model but plural

  // We dont use next() jere because res is already sending a response
  // sending a second response with next() would cause an error
});

router.put("/:id", multer({ storage: storage }).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const inventory = new Inventory({
    image: req.body.image,
    quantity: req.body.quantity,
    currency: req.body.currency,
    price: req.body.price,
    itemName: req.body.itemName
  })
  Inventory.updateOne({ _id: req.params.id }, inventory).then(result => {
    res.status(200).json({ message: "Update successful!" });
  })
});

router.get("", (req, res, next) => {
  Inventory.find() //simply returns all entries, can be narrowed down
    .then(documents => {
      res.status(200).json({
        message: 'Products fetched succesfully!',
        products: documents
      });
    });
  //200 is sucess

});

router.get("/:id", (req, res, next) => {
  Inventory.findById(req.params.id).then(inventory => {
    if (inventory) {
      res.status(200).json(inventory);
    } else {
      res.status(404).json({ message: 'Inventory not found!' })
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Inventory.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result)
  });
  res.status(200).json({ message: "Product deleted!" });
});

module.exports = router;
