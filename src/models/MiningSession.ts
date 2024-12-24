import mongoose from 'mongoose';

const MiningSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  week: { type: Number, required: true },
  currency: { type: String, required: true },
  amount: { type: Number, required: true },
  percentage: { type: [Number], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
});

export default mongoose.models.MiningSession ||
  mongoose.model('MiningSession', MiningSessionSchema);
