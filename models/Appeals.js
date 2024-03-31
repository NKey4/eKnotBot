import mongoose from "mongoose";

const AppealsSchema = new mongoose.Schema(
  {
    answer: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Appeals", AppealsSchema);
