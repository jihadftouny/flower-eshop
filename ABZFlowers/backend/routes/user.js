const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserController = require("../controllers/user");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

module.exports = router;
