import { NextResponse } from 'next/server';
import MiningSession from '@/models/MiningSession';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';

export async function PATCH(request) {
  try {
    await connectDB();

    const { userId } = await request.json();

    // Отримуємо всі активні сесії для цього користувача
    const miningSessions = await MiningSession.find({ userId, isCompleted: false });
    if (miningSessions.length === 0) {
      return NextResponse.json({ success: false, message: 'Активні сесії для цього користувача не знайдено.' });
    }

    // Обробка кожної сесії
    for (const session of miningSessions) {
      const { startDate, percentage, currency, amount, paidDays, week } = session;

      const now = new Date();
      const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      
      // Визначаємо кількість днів, які ще не були виплачені
      const daysToPay = daysSinceStart - paidDays;


      if (daysToPay > 0) {
        // Розрахунок винагороди за ці дні
        const dailyReward = (amount * (percentage / 100));
        const reward = dailyReward * daysToPay;

        // Отримуємо користувача та його баланс
        const user = await User.findById(userId);
        if (user) {
          const currentBalance = user.balance.get(currency) || 0;

          // Оновлюємо баланс
          user.balance.set(currency, (currentBalance || 0) + reward);
          
          await user.save();

          // Оновлюємо кількість сплачених днів у сесії
          session.paidDays += daysToPay;
          session.fullAmount += reward;

          // Якщо сесія завершена, встановлюємо isCompleted
          if (daysSinceStart >= week * 7) {
            const currentBalance = user.balance.get(currency) || 0;
            session.isCompleted = true;
            user.balance.set(currency, (currentBalance || 0) + amount);
          }

          await session.save();
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Баланс оновлено для користувача.' });
  } catch (error) {
    console.error('Помилка оновлення сесії:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}
