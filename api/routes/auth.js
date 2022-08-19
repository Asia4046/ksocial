const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const console = require('../util/Console')

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const randomuniqID = Math.random().toString(36).substring(2, 10);
    var nodemailer = require("nodemailer");

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      isTeacher: req.body.isTeacher,
      isAdmin: req.body.isAdmin,
      uniqID: randomuniqID,
    });
    console.log (`${req.body.username}: ${randomuniqID}`);

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    !user && res.status(404).json("user not found");

    const validpassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validpassword && res.status(400).json("password invalid");

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
