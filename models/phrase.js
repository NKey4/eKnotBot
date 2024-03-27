import mongoose from "mongoose";

const PhraseSchema = new mongoose.Schema(
  {
    text: String,
    type: String,
  },

  {
    versionKey: false,
  }
);

export default mongoose.model("Phrase", PhraseSchema);
