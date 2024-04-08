const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const phraseSchema = new Schema(
  {
    text: String,
    type: String,
  },

  {
    versionKey: false,
  }
);

const Phrase = mongoose.model("Phrase", phraseSchema);

module.exports = Phrase;
