import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  seq: {
    type: Number,
  },
});

export default mongoose.model("Counter", CounterSchema);
