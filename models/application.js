import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestLocationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    requestCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    requestSubCategoryId: {
      type: String,
      required: true,
    },
    status_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
      required: true,
    },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    dataMessage: String,
    userMessage: String,
  },
  {
    timestamps: true,
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("Application", ApplicationSchema);
