const express = require("express");
const authController = require('../controllers/authControllers');
const router = express.Router();


router.get("/signup", authController.signup_get); // to show signup
router.post("/signup", authController.signup_post); // to get data from signup form
router.get("/login", authController.login_get); // to show login form
router.post("/login", authController.login_post);// to get data from login form
router.get("/logout",authController.logout_get); // to log out from app.
module.exports=router;