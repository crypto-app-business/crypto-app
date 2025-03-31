import { NextResponse } from 'next/server';
import StakingSession from '@/models/StakingSession';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import Operations from '@/models/Operations';

export async function POST(request) {
  try {
    const { userId, currency, amount, action } = await request.json();
    if (!userId || !currency || !amount || !action) {
      return NextResponse.json({ error: 'Усі поля обов’язкові.' }, { status: 400 });
    }

    await connectDB();

    // Знаходимо користувача
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден.' }, { status: 404 });
    }

    if (!user.balance.has(currency)) {
      return NextResponse.json({ error: 'Єта криптовалюта отсуствует на балансе.' }, { status: 400 });
    }

    const currentBalance = user.balance.get(currency);
    let stakingSession;
    if(action==="add"){
      if (currentBalance < amount) {
        return NextResponse.json({ error: 'Недостаточно денег.' }, { status: 400 });
      }
      // Віднімаємо суму з балансу користувача
      user.balance.set(currency, currentBalance - amount);
      await user.save();

      const newOperation = new Operations({
        id: userId,
        description: `Вложено в стейкинг`,
        amount: amount,
        currency: "CC",
        type: 'staking',
        createdAt: new Date(),
      });
      await newOperation.save();

      // Перевіряємо, чи існує активна сесія стейкінгу для цієї криптовалюти
      stakingSession = await StakingSession.findOne({ userId, currency, isCompleted: false });

      if (stakingSession) {
        // Якщо існує, додаємо нову суму до існуючої
        stakingSession.amount += amount;
        await stakingSession.save();
      } else {
        // Якщо ні, створюємо нову сесію
        stakingSession = await StakingSession.create({
          userId,
          currency,
          amount,
          startDate: new Date(),
        });
      }
    }

    if(action==="withdraw"){
      // Віднімаємо суму з балансу користувача
      user.balance.set(currency, currentBalance + amount);
      await user.save();

      const newOperation = new Operations({
        id: userId,
        description: `Снято со стейкинга`,
        amount: amount,
        currency: "CC",
        type: 'staking',
        createdAt: new Date(),
      });
      await newOperation.save();

      // Перевіряємо, чи існує активна сесія стейкінгу для цієї криптовалюти
      stakingSession = await StakingSession.findOne({ userId, currency, isCompleted: false });

      if (stakingSession) {
        // Якщо існує, додаємо нову суму до існуючої
        stakingSession.amount -= amount;
        await stakingSession.save();
      } else {
        // Якщо ні, створюємо нову сесію
        stakingSession = await StakingSession.create({
          userId,
          currency,
          amount,
          startDate: new Date(),
        });
      }
    }

    return NextResponse.json({ success: true, data: stakingSession });
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

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден.' }, { status: 404 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId є обов’язковим.' }, { status: 400 });
    }

    const userSessions = await StakingSession.find({ userId, isCompleted: false });
    
    return NextResponse.json({ success: true, sessions: userSessions, user : user });
  } catch (error) {
    console.error('Помилка отримання стейкінг-сесій:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}