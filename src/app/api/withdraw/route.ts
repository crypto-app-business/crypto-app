import { NextResponse } from 'next/server';
import StakingSession from '@/models/StakingSession';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';

export async function POST(request) {
  try {
    const { userId, currency, amount } = await request.json();
    if (!userId || !currency || !amount) {
      return NextResponse.json({ error: 'Усі поля обов’язкові.' }, { status: 400 });
    }

    await connectDB();

    // Знаходимо користувача
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Користувач не знайдений.' }, { status: 404 });
    }

    // Знаходимо активну сесію стейкінгу для цієї криптовалюти
    const stakingSession = await StakingSession.findOne({ userId, currency, isCompleted: false });

    if (!stakingSession) {
      return NextResponse.json({ error: 'Активна сесія стейкінгу для цієї криптовалюти не знайдена.' }, { status: 404 });
    }

    if (stakingSession.amount < amount) {
      return NextResponse.json({ error: 'Недостатньо коштів у сесії стейкінгу.' }, { status: 400 });
    }

    // Віднімаємо суму зі стейкінгу
    stakingSession.amount -= amount;

    if (stakingSession.amount === 0) {
      // Якщо сума у сесії стала 0, позначаємо сесію як завершену
      stakingSession.isCompleted = true;
      stakingSession.endDate = new Date();
    }
    await stakingSession.save();

    // Додаємо кошти назад на баланс користувача
    const currentBalance = user.balance.get(currency) || 0;
    user.balance.set(currency, currentBalance + amount);
    await user.save();

    return NextResponse.json({ success: true, data: { balance: user.balance, session: stakingSession } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}
