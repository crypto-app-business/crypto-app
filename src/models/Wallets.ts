import { Schema, model, models } from 'mongoose';

interface WalletSchema {
  id: string;
  network: string;
  wallet: string;
  createdAt: Date;
}

const WalletSchema = new Schema<WalletSchema>({
  id: { type: String, required: true },
  network: { type: String, required: true },
  wallet: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Wallets = models.Wallet || model<WalletSchema>('Wallet', WalletSchema);

export default Wallets;
