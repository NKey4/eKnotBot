const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const phraseSchema = new Schema(
  {
    text: String,
  },
  {
    versionKey: false,
  }
);

const Phrase = mongoose.model("Phrase", phraseSchema);

module.exports = Phrase;
