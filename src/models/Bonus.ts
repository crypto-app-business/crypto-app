import { Schema, model, models } from 'mongoose';

interface BonusSchema {
  id: string;
  rang: number;
  rangWait: number;
  bonus: number;
  bonusRef: number;
  bonusGet: number[]
  createdAt: Date;
}

const BonusSchema = new Schema<BonusSchema>({
  id: { type: String, required: true },
  rang: { type: Number, required: true, default: 1 },
  rangWait: { type: Number, required: true, default: 1 },
  bonus: { type: Number, required: true, default: 0 },
  bonusRef: { type: Number, required: true, default: 0 },
  bonusGet: { type: [Number], required: true, default: []},
  createdAt: { type: Date, default: Date.now },
});

const Bonus = models.Bonus || model<BonusSchema>('Bonus', BonusSchema);

export default Bonus;
