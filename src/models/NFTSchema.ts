// models/NFT.ts
import mongoose from 'mongoose';

const NFTSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Назва NFT
  imageId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID файлу в GridFS
  percentage: { type: Number, required: true }, // Відсоток за весь час
  durationDays: { type: Number, required: true }, // Тривалість активності (дні)
  activationDays: { type: Number, required: true }, // Кількість днів для активації
  price: { type: Number, required: true }, // Ціна NFT
  createdAt: { type: Date, default: Date.now }, // Дата створення
});

export default mongoose.models.NFT || mongoose.model('NFT', NFTSchema);