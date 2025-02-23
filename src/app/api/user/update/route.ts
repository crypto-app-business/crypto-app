import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import bcrypt from 'bcrypt';

// Типізація для JWT payload
interface JwtPayload {
  id: string;
  email: string;
}

// Типізація для оновлюваних даних
interface UpdateData {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  telegramId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function PATCH(request: Request) {
  try {
    // Отримуємо токен з заголовка
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Токен відсутній або невалідний' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: 'Невалідний токен' }, { status: 401 });
    }

    // Підключаємося до бази даних
    await connectDB();

    // Отримуємо дані з тіла запиту
    const body: UpdateData = await request.json();
    const updateData: UpdateData = { ...body };

    // Якщо оновлюється пароль, хешуємо його
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Оновлюємо користувача
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'Користувача не знайдено' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Данные успешно обновлено',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Внутрішня помилка сервера' }, { status: 500 });
  }
}