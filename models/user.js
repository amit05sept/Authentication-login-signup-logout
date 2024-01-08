const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    validate: [isEmail, "email should be a valid email"],
  },
  password: {
    type: String,
    required: [true, "password is require"],
    minlength: [6, "password should be atleast 6 character long"],
  },
});

// mongoose hooks
// pre , post -> data saved into the db.
UserSchema.pre("save", async function (next) {
  // console.log(this);
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// static methods on model
UserSchema.statics.login= async function(email,password){
  const user = await User.findOne({ email });
  if (!user) {
    throw Error("email not registered");
  }

  // verify the password
  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!passwordMatched) {
    throw Error("password not correct");
  }
  return user;
}


const User = mongoose.model("user", UserSchema);

module.exports = User;
