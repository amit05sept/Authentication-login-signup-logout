const jwt = require("jsonwebtoken");
const secretKey = "secret key #@123";
const User = require("../models/user");
const authUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.redirect("/user/login");
    return;
  } else {
    jwt.verify(token, secretKey, (err, Data) => {
      if (err) {
        res.redirect("/user/login");
        return;
      } else {
        next();
      }
    });
  }
};

// check which user is loged in
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.locals.user = null;
    next();
  } else {
    jwt.verify(token, secretKey,async (err, Data) => {
      if (err) {
        // res.redirect("/user/login");
        res.locals.user = null;
        next();
      } else {
        const user = await User.findById(Data.id);
        res.locals.user = user;
        next();
      }
    });
  }
};

module.exports = { authUser, checkUser };
