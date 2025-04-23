import mongoose, { Schema, Document } from 'mongoose';

// Інтерфейс для документа користувача
interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  password2?: string;
  phone: string;
  country: string;
  referrer?: string;
  balance: Map<string, number>;
  role: 'user' | 'admin';
  telegramId?: string;
  createdAt: Date;
  updatedAt: Date;
  avatar: string;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    password2: { type: String },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    referrer: { type: String },
    balance: { type: Map, of: Number, default: {} },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    telegramId: { type: String },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;