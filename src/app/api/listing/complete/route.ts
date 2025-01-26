import { NextResponse } from 'next/server';
import ListingSession from '@/models/ListingSession';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';

export async function PATCH(request) {
  try {
    await connectDB();

    const { userId } = await request.json();

    // Отримуємо всі активні сесії для цього користувача
    const listingSession = await ListingSession.find({ userId, isCompleted: false });

    if (listingSession.length === 0) {
      return NextResponse.json({ success: false, message: 'Активні сесії для цього користувача не знайдено.' });
    }

    for (const session of listingSession) {
      const { startDate, percentage, currency, amount, paidDays, day } = session;
      const now = new Date();
      const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysToPay = daysSinceStart - paidDays;

      if (daysToPay > 0) {
        const dailyReward = (amount * (percentage / 100));
        const reward = dailyReward * daysToPay;
        const user = await User.findById(userId);

        if (user) {
          if (amount > 25000) {
            // Відсотки нараховуються щодня та додаються до тіла лістингу
            session.amount += reward;
          }
          if (daysSinceStart >= day) {
            // Виплата всієї суми тільки після закінчення строку
            const currentBalance = user.balance.get(currency) || 0;
            user.balance.set(currency, currentBalance + amount + reward);
          }

          session.paidDays += daysToPay;
          session.fullAmount += reward;
          if (daysSinceStart >= day) {
            session.isCompleted = true;
          }

          await session.save();
          await user.save();
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Баланс оновлено для користувача.' });
  } catch (error) {
    console.error('Помилка оновлення сесії:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}
