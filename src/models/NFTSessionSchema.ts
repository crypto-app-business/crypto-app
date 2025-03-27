// models/NFTSession.ts
import mongoose from 'mongoose';

const NFTSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nftId: { type: mongoose.Schema.Types.ObjectId, ref: 'NFT', required: true },
  currency: { type: String, required: true },
  amount: { type: Number, required: true }, // Початкова сума (тіло)
  percentage: { type: Number, required: true }, // Відсоток за весь час
  durationDays: { type: Number, required: true }, // Тривалість (дні)
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  paidDays: { type: Number, default: 0 }, // Кількість днів, за які вже виплачено
  isCompleted: { type: Boolean, default: false }, // Чи завершена сесія
  totalReward: { type: Number, default: 0 }, // Загальна сума виплачених відсотків
});

export default mongoose.models.NFTSession || mongoose.model('NFTSession', NFTSessionSchema);