const mongoose = require("mongoose");
// const app = require('./app');
const port = process.env.PORT || 3000;
const mongoURL = process.env.Mongo_URL;
// console.log(mongoURL);
async function connectToDatabase(app) {
  try {
    const res = await mongoose.connect(`${mongoURL}`);
    console.log('connected to db...');
    app.listen(port,()=>{
        console.log('server started...');
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectToDatabase;
