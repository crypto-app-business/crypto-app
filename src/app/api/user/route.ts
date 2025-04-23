import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { cookies } from 'next/headers'; // Імпортуємо утиліту для роботи з cookies
import connectDB from '@/utils/connectDB';
import Avatar from '@/models/Avatar';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function GET() {
  try {
    // Отримання токена з cookies
    const cookieStore = await cookies(); // Очікуємо проміс
    const token = cookieStore.get('authToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Розшифрування токена
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Підключення до MongoDB
    await connectDB();

    // Пошук користувача
    const user = await User.findById(decoded.id); // `decoded.id` повинен відповідати ID користувача в базі
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const avatar = await Avatar.findOne({ userId: user._id });
    // Повернення балансу
    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        balance: user.balance || {}, // Повертаємо баланс або порожній об'єкт
        referrer: user.referrer,
        phone: user.phone,
        telegramId: user.telegramId,
        registrationDate: user.createdAt,
        avatar: avatar ? avatar.avatarUrl : null,
      },
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
