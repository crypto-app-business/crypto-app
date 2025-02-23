import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Operations from '@/models/Operations';
import connectDB from '@/utils/connectDB';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function GET(request: Request) {
  try {
    // Отримання токену з куків
    const token = request.headers.get('cookie')?.split(';').find(cookie => cookie.trim().startsWith('authToken='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Немає токену для авторизації' }, { status: 401 });
    }

    // Верифікація токену
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    if (!decoded?.id) {
      return NextResponse.json({ error: 'Невалідний токен' }, { status: 401 });
    }

    // Підключення до бази даних
    await connectDB();

    // Отримання операцій користувача
    const operations = await Operations.find({ id: decoded.id });

    return NextResponse.json({ success: true, operations }, { status: 200 });
  } catch (error) {
    console.error('GET operations error:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
