import { NextResponse } from 'next/server';
import MiningSession from '@/models/MiningSession';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';

export async function POST(request) {
  try {
    const { userId, week, currency, amount, percentage } = await request.json();

    if (!userId || !week || !currency || !amount) {
      return NextResponse.json({ error: 'Усі поля обов’язкові.' }, { status: 400 });
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
    console.log(amount)
    console.log(user.balance.get(currency))
    // Оновлюємо баланс
    user.balance.set(currency, currentBalance - amount);
    console.log(user.balance.get(currency))
    await user.save();
    console.log(user.balance.get(currency))

    // Генерація відсотків для кожного тижня
    // const percentage = [];
    // for (let i = 1; i <= week; i++) {
    //   percentage.push(1 + i * 0.1); // Наприклад: 1% за 1 тиждень, 1.1% за 2 тиждень, тощо
    // }

    const newSession = await MiningSession.create({
      userId,
      week,
      currency,
      amount,
      percentage,
      startDate: new Date(),
      endDate: new Date(Date.now() + week * 7 * 24 * 60 * 60 * 1000),
      paidDays: 0,
    });
    console.log(newSession)
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

    const userSessions = await MiningSession.find({ userId, isCompleted: false });
    
    return NextResponse.json({ success: true, sessions: userSessions });
  } catch (error) {
    console.error('Помилка отримання майнінг-сесій:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}