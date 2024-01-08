const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secretKey = "secret key #@123";
const maxAge = 3 * 24 * 60 * 60; //in seconds

module.exports.signup_get = (req, res) => {
  res.render("authViews/signup", { title: "signup" });
};

const handleErrors = function (err) {
  // console.log(err);
  let errors = { email: "", password: "" };

  // login errors......
  if (err.message === "email not registered") {
    errors.email = err.message;
    return errors;
  } else if (err.message === "password not correct") {
    errors.password = err.message;
    return errors;
  }

  // signup errors......
  //validate errors
  // validating unique email id
  if (err.code === 11000) {
    errors.email = "email is already used";
    return errors;
  }

  // rest other errors.
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const createToken = function (id) {
  return jwt.sign({ id }, secretKey, {
    expiresIn: maxAge,
  });
};

module.exports.signup_post = async (req, res) => {
  try {
    const { password, email } = req.body;
    //   console.log(password, email);
    const user = await User.create({ email, password });
    // jwtwebtoken sent to res.cookie
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json(user._id);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.login_get = (req, res) => {
  res.render("authViews/login", { title: "login" });
};

module.exports.login_post = async (req, res) => {
  //db search
  try {
    const { email, password } = req.body;
    // console.log(email, password);
    // const user = await User.findOne({ email });
    // if (!user) {
    //   throw Error("email not registered");
    // }

    // // verify the password
    // const passwordMatched = await bcrypt.compare(password, user.password);
    // if (!passwordMatched) {
    //   throw Error("password not correct");
    // }
    const user = await User.login(email,password);

    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json(user._id);
    // res.json("loged in");
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};


module.exports.logout_get=(req,res)=>{
  res.cookie('jwt','',{maxAge:1});
  res.redirect('/');
}