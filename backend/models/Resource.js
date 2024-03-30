const mongoose = require("mongoose");
// const user = require('./user')
const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
  },
  filePath: {
    type: String,
    required: true,
    unique: true,
  }
});

module.exports = mongoose.model("resources", resourceSchema);
