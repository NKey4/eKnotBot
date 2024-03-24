import mongoose from 'mongoose';

const phraseSchema = new mongoose.Schema(
  {
    text: String,
    type: String,
  },

  {
    versionKey: false,
  }
);

export default mongoose.model("Phrase", phraseSchema);
