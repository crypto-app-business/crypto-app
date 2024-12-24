import { Schema, model, models } from 'mongoose';

interface DepositSchema {
  id: string;
  currency: string;
  amount: number;
  status: string;
  createdAt: Date;
}

const DepositSchema = new Schema<DepositSchema>({
  id: { type: String, required: true },
  currency: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Deposit = models.Deposit || model<DepositSchema>('Deposit', DepositSchema);

export default Deposit;
