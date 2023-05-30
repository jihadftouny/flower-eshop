//this is a express file node.js server file taking express features

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser'); //this is a node express package
const mongoose = require("mongoose");



const productsRoutes = require("./routes/products")
const usersRoutes = require("./routes/user")


// storing the express import in a constant
const app = express();
mongoose.connect("mongodb://localhost:27017/abz-flowers") //process.env.MONGO_ATLAS_PW will be here
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  })
// now we're going to make a funnel for this express request, where each part of the funnel does something different

// send a response with a middleware
// this use middle ware takes a function
// it takes request and response just like the node.js basic server did, and in addition the next function

app.use(bodyParser.json());
//you can also do other types of body suchs as:
//app.use(bodyParser.urlencoded({ extended: false })); //this line can be commented out, it's not being used right now
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images"))); //any request with /images are alowed to access now, but you have to map with path package, forwarding it to backend/images

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});



//imports products.js from routes folder
app.use("/api/products", productsRoutes);
app.use("/api/user", usersRoutes);

//now we want to export this app to the node.js server in root folder

// instead of using export keyword, we will use module object that has an exports object

module.exports = app;

//now we import in the server.js
