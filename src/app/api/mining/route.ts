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
      return NextResponse.json({ error: 'Недостатньо коштів.' }, { status: 400 });
    }
    
    // Оновлюємо баланс
    user.balance.set(currency, currentBalance - amount);
    await user.save();

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
    });

    return NextResponse.json({ success: true, data: newSession });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const sessions = await MiningSession.find({ isCompleted: false });
    console.log('Active Mining Sessions:', sessions); // Лог активних сесій
    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error('Помилка отримання майнінг-сесій:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}