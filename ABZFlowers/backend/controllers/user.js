const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {


  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
}

exports.userLogin = async(req, res, next) => {
  try {
    let fetchedUser;
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }

    fetchedUser = user;
    const result = await bcrypt.compare(req.body.password, user.password);

    if (!result) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }

    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id, phoneNumber: fetchedUser.phoneNumber},
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );


    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Invalid authentication credentials!"
    });
  }
}

exports.getUsers = (req, res, next) => {
  const pageSize = +req.query.pagesize; //these second parameters are up to youy "pagesize" "page"
  const currentPage = +req.query.page;
  const userQuery = User.find();
  let fetchedUsers;
  if (pageSize && currentPage) {
    userQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  userQuery //simply returns all entries, can be narrowed down
    .then(documents => {
      fetchedUsers = documents;
      return User.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Users fetched succesfully!',
        users: fetchedUsers,
        maxUsers: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching users failed!"
      })
    });
  //200 is sucess

};

exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching user failed!"
      });
    });
};

exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if (result.modifiedCount > 0){
      res.status(200).json({ message: "Deletion successful!" });
    }
    else {
      res.status(401).json({ message: "You are not authorized!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Deleting user failed!"
    })
  });

};

