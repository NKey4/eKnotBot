import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    seq: {
      type: Number,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("Counter", CounterSchema);
