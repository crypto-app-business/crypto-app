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

      // const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)); // кількість днів від початку
      const weeksSinceStart = Math.floor(daysSinceStart / 7); // кількість тижнів від початку

      console.log(`Тижнів з початку сесії: ${weeksSinceStart}`);
      console.log(`Тижнів для виплати: ${paidDays}`);
      
      // Визначаємо кількість тижнів, які ще не були виплачені
      const weeksToPay = weeksSinceStart - paidDays;

      console.log(`Кількість тижнів для виплати: ${weeksToPay}`);

      if (weeksToPay > 0) {
        // Розрахунок винагороди за ці тижні
        const reward = (amount * (percentage / 100)) * 7 * weeksToPay;

        // Отримуємо користувача та його баланс
        const user = await User.findById(userId);
        console.log(user)
        if (user) {
          const currentBalance = user.balance.get(currency) || 0;
          console.log('user.balance.USDT', user.balance.get(currency) )
          console.log('currentBalance', currentBalance )
          console.log('currency', currency)
          console.log('user.balance', user.balance )
          console.log('Баланс до оновлення:', currentBalance);
          console.log('Сума для виплати:', reward);

          // Оновлюємо баланс
          // user.balance[currency] = currentBalance + reward;
          user.balance.set(currency, (currentBalance || 0) + reward);
          console.log( 'user.balance[currency]', user.balance.get(currency))
          console.log('currentBalance', currentBalance )
          console.log('Оновлений баланс:', user.balance.get(currency));
          
          await user.save();

          // Оновлюємо кількість сплачених тижнів у сесії
          session.paidDays += weeksToPay;

          // Якщо сесія завершена, встановлюємо isCompleted
          if (weeksSinceStart >= week) {
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
