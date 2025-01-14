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
    console.log(miningSessions);
    if (miningSessions.length === 0) {
      return NextResponse.json({ success: false, message: 'Активні сесії для цього користувача не знайдено.' });
    }

    // Обробка кожної сесії
    for (const session of miningSessions) {
      const { startDate, percentage, currency, amount, paidDays, week } = session;

      const now = new Date();
      console.log(now);
      const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      console.log(`Днів з початку сесії: ${daysSinceStart}`);
      console.log(`Виплачені дні: ${paidDays}`);
      
      // Визначаємо кількість днів, які ще не були виплачені
      const daysToPay = daysSinceStart - paidDays;

      console.log(`Кількість днів для виплати: ${daysToPay}`);

      if (daysToPay > 0) {
        // Розрахунок винагороди за ці дні
        const dailyReward = (amount * (percentage / 100));
        const reward = dailyReward * daysToPay;

        // Отримуємо користувача та його баланс
        const user = await User.findById(userId);
        console.log(user);
        if (user) {
          const currentBalance = user.balance.get(currency) || 0;
          console.log('Баланс до оновлення:', currentBalance);
          console.log('Сума для виплати:', reward);

          // Оновлюємо баланс
          user.balance.set(currency, (currentBalance || 0) + reward);
          console.log('Оновлений баланс:', user.balance.get(currency));
          
          await user.save();

          // Оновлюємо кількість сплачених днів у сесії
          session.paidDays += daysToPay;

          // Якщо сесія завершена, встановлюємо isCompleted
          if (daysSinceStart >= week * 7) {
            session.isCompleted = true;
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
