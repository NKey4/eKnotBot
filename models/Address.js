import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
});

export default mongoose.model("Address", AddressSchema);
