import { NextResponse } from 'next/server';
import MiningSession from '@/models/MiningSession';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import Operations from '@/models/Operations';

export async function PATCH(request) {
  try {
    await connectDB();

    const { userId } = await request.json();

    // Отримуємо всі активні сесії для цього користувача
    const miningSessions = await MiningSession.find({ userId, isCompleted: false });
    if (miningSessions.length === 0) {
      return NextResponse.json({ success: false, message: 'Активние сесиии не найдени.' });
    }

    // Обробка кожної сесії
    for (const session of miningSessions) {
      const { startDate, percentage, currency, amount, paidDays, week } = session;

      const now = new Date();
      // Нормалізуємо today до початку поточного дня в UTC для обчислення daysSinceStart
      const today = new Date(now);
      today.setUTCHours(0, 0, 0, 0);
      // Обчислюємо кількість днів, включаючи поточний день
      const daysSinceStart = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

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

          for (let i = 0; i < daysToPay; ++i) {
            // Обчислюємо дату, віднімаючи дні від now
            const operationDate = new Date(now);
            operationDate.setUTCDate(now.getUTCDate() - (daysToPay - 1 - i));
            const newOperation = new Operations({
              id: userId,
              description: `Получено с майнинга`,
              amount: dailyReward,
              currency: "USDT",
              type: 'mining',
              createdAt: operationDate, // Використовуємо дату з актуальним часом
            });

            await newOperation.save();
          }

          // Оновлюємо кількість сплачених днів у сесії
          session.paidDays += daysToPay;
          session.fullAmount += reward;

          // Якщо сесія завершена, встановлюємо isCompleted
          if (daysSinceStart >= week * 7) {
            const currentBalance = user.balance.get(currency) || 0;
            session.isCompleted = true;
            user.balance.set(currency, (currentBalance || 0) + amount);
            const newOperation = new Operations({
              id: userId,
              description: `Получено с майнинга`,
              amount: amount,
              currency: "USDT",
              type: 'mining',
              createdAt: new Date(), // Для завершення сесії залишаємо поточну дату
            });
            await newOperation.save();
          }
          await user.save();
          await session.save();
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Баланс обновлен' });
  } catch (error) {
    console.error('Помилка оновлення сесії:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}