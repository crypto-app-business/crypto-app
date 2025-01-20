import mongoose from 'mongoose';

const StakingSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currency: { type: String, required: true },
  amount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isCompleted: { type: Boolean, default: false },
  fullAmount: { type: Number, default:0},
});

export default mongoose.models.StakingSession ||
  mongoose.model('StakingSession', StakingSessionSchema);