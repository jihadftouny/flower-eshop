//this is a express file node.js server file taking express features

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser'); //this is a node express package
const mongoose = require("mongoose");



const postsRoutes = require("./routes/posts")



// handling a request for a single op
// storing the express import in a constant
const app = express();
mongoose.connect("mongodb+srv://jihanger97:PASSWORD@cluster0.ldydwg8.mongodb.net/node-angular?retryWrites=true&w=majority")
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

app.use("/images", express.static(path.join("backend/images"))); //any request with /images are alowed to access now, but you have to map with path package, forwarding it to backend/images

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});



//imports posts.js from routes folder
app.use("/api/posts", postsRoutes);

//now we want to export this app to the node.js server in root folder

// instead of using export keyword, we will use module object that has an exports object

module.exports = app;

//now we import in the server.js
