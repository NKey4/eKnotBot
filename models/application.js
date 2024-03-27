import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    yandexId: {
      type: String,
      required: true,
    },
    apartmentId: {
      type: String,
      required: true,
    },
    requestLocationId: {
      type: String,
      required: true,
    },
    requestCategoryId: {
      type: String,
      required: true,
    },
    requestSubCategoryId: {
      type: String,
      required: true,
    },
    status_id: {
      type: String,
      required: true,
    },
    yandexAddress: {
      type: String,
      required: true,
    },
    dataMessage: String,
    userMessage: String,
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("Application", ApplicationSchema);
