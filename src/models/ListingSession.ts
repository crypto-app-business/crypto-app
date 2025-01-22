import mongoose from 'mongoose';

const ListingSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: { type: Number, required: true },
  currency: { type: String, required: true },
  amount: { type: Number, required: true },
  percentage: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  paidDays: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  fullAmount: { type: Number, default:0},
});

export default mongoose.models.ListingSession ||
  mongoose.model('ListingSession', ListingSessionSchema);
