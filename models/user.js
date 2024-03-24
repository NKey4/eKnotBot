import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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
  yandexId: String,
  address: Array,
  entryDate: Date,
}, {
  timestamps: true,
});

export default mongoose.model('User', UserSchema);