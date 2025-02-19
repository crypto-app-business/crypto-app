import { Schema, model, models } from 'mongoose';

interface WithdrawalSchema {
  id: string;
  currency: string;
  amount: number;
  status: string;
  createdAt: Date;
  waletId: string;
}

const WithdrawalSchema = new Schema<WithdrawalSchema>({
  id: { type: String, required: true },
  currency: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  waletId: { type: String, required: true },
});

const Withdrawal = models.Withdrawal || model<WithdrawalSchema>('Withdrawal', WithdrawalSchema);

export default Withdrawal;
