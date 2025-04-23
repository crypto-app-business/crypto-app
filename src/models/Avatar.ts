import mongoose, { Schema, Document } from 'mongoose';

interface IAvatar extends Document {
  userId: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const AvatarSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, unique: true }, // Посилання на _id користувача
    avatarUrl: { type: String, required: true }, // URL аватара в GridFS
  },
  { timestamps: true }
);

export default mongoose.models.Avatar || mongoose.model<IAvatar>('Avatar', AvatarSchema);