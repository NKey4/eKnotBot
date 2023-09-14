const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  yandex_id: { type: String, required: true },
  address: {
    type: [String],
    required: true,
  },
  entryDate: Date,
  name: String,
  phoneNumber: { type: String, required: true },
  debt: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
