import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
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
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Application", applicationSchema);