import mongoose from "mongoose";
import Address from "./Address.js";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    confirmationCode: String,
    aliceCode: String,
    yandex_id: String,
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    entryDate: Date,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
