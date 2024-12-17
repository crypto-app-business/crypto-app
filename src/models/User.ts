import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    nickname: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
