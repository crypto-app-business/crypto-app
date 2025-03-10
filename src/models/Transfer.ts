import { Schema, model, models } from 'mongoose';

interface TransferSchema {
  id: string;
  currency: string;
  amount: number;
  status: string;
  username: string;
  createdAt: Date;
}

const TransferSchema = new Schema<TransferSchema>({
  id: { type: String, required: true },
  username: { type: String, required: true },
  currency: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Transfer = models.Transfer || model<TransferSchema>('Transfer', TransferSchema);

export default Transfer;
