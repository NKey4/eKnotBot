const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const applicationSchema = new Schema(
  {
    _id: { type: String, required: true },
    yandex_id: String,
    location: {
      type: String,
      required: true,
    },
    worktype: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    address: {
      type: [String],
      required: true,
    },
    description: String,
    status: Number,
    viewing: Boolean,
  },
  {
    versionKey: false,
  }
);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
