const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  address: {
    type: [String],
    required: true,
  },
  entryDate: Date,
  name: String,
  phoneNumber: String,
  debt: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
