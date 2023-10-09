const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const applicationSchema = new Schema(
  {
    _id: {
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

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
