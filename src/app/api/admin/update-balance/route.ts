import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function PATCH(request: Request) {
  try {
    await connectDB();

    // Перевірка авторизації
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Неавторизований' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    } catch (error) {
      console.error("Недійсний токен:", error);
      return NextResponse.json({ error: 'Недійсний токен' }, { status: 401 });
    }

    // Перевірка ролі адміністратора
    const adminUser = await User.findById(decoded.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Недостатньо прав' }, { status: 403 });
    }

    // Отримання даних із запиту
    const { username, balance } = await request.json();

    if (!username || !balance || typeof balance.CC !== 'number' || typeof balance.USDT !== 'number') {
      return NextResponse.json({ error: 'Некоректні дані: username, CC та USDT обов’язкові' }, { status: 400 });
    }

    // Оновлення балансу користувача
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'Користувача не знайдено' }, { status: 404 });
    }

    // Робота з Map: оновлюємо CC і USDT, зберігаємо інші валюти
    const currentBalance = user.balance instanceof Map ? user.balance : new Map();
    currentBalance.set('CC', balance.CC);
    currentBalance.set('USDT', balance.USDT);
    user.balance = currentBalance;

    await user.save();

    // Перетворюємо Map у об’єкт для відповіді
    const balanceObject = Object.fromEntries(user.balance);

    return NextResponse.json({ success: true, user: { ...user.toObject(), balance: balanceObject } });
  } catch (error) {
    console.error('Помилка при оновленні балансу:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}