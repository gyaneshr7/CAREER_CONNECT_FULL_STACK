const mongoose = require("mongoose");
// const user = require('./user')
const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  url: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type:{
    type:String
  },
  driveId:{
    type:String
  }
});

module.exports = mongoose.model("resources", resourceSchema);
