import { Schema, model, models } from 'mongoose';

interface OperationsSchema {
  id: string;
  description: string;
  amount: number;
  currency: string;
  type: 'deposit' | 'withdrawal' | 'mining' | 'staking' | 'listing' | 'depositFromUser';
  createdAt: Date;
}

const OperationsSchema = new Schema<OperationsSchema>({
  id: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  type: { type: String, enum: ['deposit', 'withdrawal' , 'mining' , 'staking' , 'listing' , 'depositFromUser'], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Operations = models.Operations || model<OperationsSchema>('Operations', OperationsSchema);

export default Operations;
