require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectToDB = require("./database");
const authRouter = require("./routes/authRoutes");
const { authUser, checkUser } = require("./middleware/authMiddleware");
// const {render} = require('ejs');
const app = express();
// const port = process.env.PORT || 3000;
//connect to Database
connectToDB(app);

//setting the view engine
app.set("view engine", "ejs");
// setting the path of views directory
app.set("views", path.join(__dirname, "views"));

// middleware
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(cookieParser());

// middleware to apply to every single 'get' request
app.get("*", checkUser);
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});
app.get("/smoothies", authUser, (req, res) =>
  res.render("smoothies", { title: "Smoothies" })
);

app.use("/user", authRouter);

// // cookies interaction
// app.get("/set-cookies", (req, res) => {
//   // setting the cookies.
//   // res.setHeader("set-cookie", "newUser=true");
//   // using cookieParser
//   res.cookie("newUser", false, {
//     maxAge: 1000 * 60 * 60 * 24 * 3,
//     httpOnly: true,
//   });
//   // we can also put 'secure' in this , that will only allow to send cookies via
//   // a https connections only.
//   res.send("cookies set");
// });

// app.get("/read-cookies", (req, res) => {
//   const cookie = req.cookies;
//   console.log(cookie);
//   res.send("see console.log");
// });
