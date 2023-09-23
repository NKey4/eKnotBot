const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const applicationSchema = new Schema(
  {
    _id: { 
      type: String, 
      required: true 
    },
    yandex_id: {
      type: String,
      required: true,
    },
    location_id: {
      type: String,
      required: true,
    },
    worktype_id: {
      type: String,
      required: true,
    },
    address: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status_id: {
      type: String,
      required: true,
    },
    viewing: 
    {
      type: Boolean,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
