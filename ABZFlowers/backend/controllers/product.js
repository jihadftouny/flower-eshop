const Product = require("../models/product");

exports.createProduct = (req, res, next) => {

  const url = req.protocol + '://' + req.get("host");
  //you're calling this from the models folder product.js, you gave its name as'Product'
  const product = new Product({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    quantity: req.body.quantity,
    price: req.body.price,
    currency: req.body.currency,
    creator: req.userData.userId
  }); //this object is being managed by mongoose, you can save the objects created here directly on monngoDB
  product.save().then(createdProduct => {
    res.status(201).json({
      message: "Product added succesfully",
      product: {
        ...createdProduct, //created properties with all the properties of createdProduct
        id: createdProduct._id //override to _id property
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a product failed!"
    })
  }); //mongoose function, will create a collection called the same name as the model but plural

  // We dont use next() jere because res is already sending a response
  // sending a second response with next() would cause an error
};

exports.updateProduct = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const product = new Product({
    _id: req.body.id,
    imagePath: imagePath,
    quantity: req.body.quantity,
    currency: req.body.currency,
    price: req.body.price,
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId
  })
  console.log(product);
  // Product.updateOne({ _id: req.params.id }, product).then(result => {
  //   res.status(200).json({ message: "Update successful!" });
  // })
  Product.updateOne({ _id: req.params.id, creator: req.userData.userId }, product).then(result => {
    console.log(result);
    if (result.modifiedCount > 0){
      res.status(200).json({ message: "Update successful!" });
    }
    else {
     res.status(401).json({ message: "You are not authorized!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update product"
    })
  });
};

exports.getProducts = (req, res, next) => {
  const pageSize = +req.query.pagesize; //these second parameters are up to youy "pagesize" "page"
  const currentPage = +req.query.page;
  const productQuery = Product.find();
  let fetchedProducts;
  if (pageSize && currentPage) {
    productQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  productQuery //simply returns all entries, can be narrowed down
    .then(documents => {
      fetchedProducts = documents;
      return Product.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Products fetched succesfully!',
        products: fetchedProducts,
        maxProducts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching products failed!"
      })
    });
  //200 is sucess

};

exports.getProduct = (req, res, next) => {
  Product.findById(req.params.id)
    .then(product => {
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "Product not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching product failed!"
      });
    });
};

exports.deleteProduct = (req, res, next) => {
  Product.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    res.status(200).json({ message: "Deletion successful!" });
    // if (result.modifiedCount > 0){
    //   res.status(200).json({ message: "Deletion successful!" });
    // }
    // else {
    //   res.status(401).json({ message: "You are not authorized!" });
    // }
  })
  .catch(error => {
    res.status(500).json({
      message: "Deleting product failed!"
    })
  });

};
