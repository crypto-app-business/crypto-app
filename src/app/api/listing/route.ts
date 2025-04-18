import { NextResponse } from 'next/server';
import ListingSession from '@/models/ListingSession';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import Operations from '@/models/Operations';

export async function POST(request) {
  try {
    const { userId, day, currency, amount, percentage } = await request.json();
    // const { userId, week, currency, amount, percentage } = await request.json();

    if (!userId || !day || !currency || !amount ) {
      return NextResponse.json({ error: 'Все поля обязательны.' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Користувач не знайдений.' }, { status: 404 });
    }

    if (!user.balance.has(currency)) {
      return NextResponse.json({ error: 'Ця криптовалюта відсутня на балансі.' }, { status: 400 });
    }
    const currentBalance = user.balance.get(currency);
    if (currentBalance < amount) {
      return NextResponse.json({ error: 'Недостаточно денег' }, { status: 400 });
    }
    // Оновлюємо баланс
    user.balance.set(currency, currentBalance - amount);
    await user.save();

    const newOperation = new Operations({
      id: userId,
      description: `Вложено в листинг`,
      amount: amount,
      currency: "USDT",
      type: 'listing',
      createdAt: new Date(),
    });
    await newOperation.save();

    const newSession = await ListingSession.create({
      userId,
      day,
      currency,
      amount,
      percentage,
      startDate: new Date(),
      endDate: new Date(Date.now() + day * 24 * 60 * 60 * 1000),
      paidDays: 0,
    });
    return NextResponse.json({ success: true, data: newSession });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId є обов’язковим.' }, { status: 400 });
    }

    const userSessions = await ListingSession.find({ userId, isCompleted: false });
    
    return NextResponse.json({ success: true, sessions: userSessions });
  } catch (error) {
    console.error('Помилка отримання майнінг-сесій:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}