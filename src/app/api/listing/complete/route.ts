// import { NextResponse } from 'next/server';
// import ListingSession from '@/models/ListingSession';
// import User from '@/models/User';
// import connectDB from '@/utils/connectDB';

// export async function PATCH(request) {
//   try {
//     await connectDB();

//     const { userId } = await request.json();

//     // Отримуємо всі активні сесії для цього користувача
//     const listingSession = await ListingSession.find({ userId, isCompleted: false });

//     if (listingSession.length === 0) {
//       return NextResponse.json({ success: false, message: 'Активні сесії для цього користувача не знайдено.' });
//     }

//     for (const session of listingSession) {
//       const { startDate, percentage, currency, amount, paidDays, day } = session;
//       const now = new Date();
//       const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
//       const daysToPay = daysSinceStart - paidDays;

//       if (daysToPay > 0) {
//         const dailyReward = (amount * (percentage / 100));
//         const reward = dailyReward * daysToPay;
//         const user = await User.findById(userId);

//         if (user) {
//           if (amount > 25000) {
//             session.amount += reward;
//             // для 50 0000 каждий день возвращает 12 500
//           }
//           if (daysSinceStart >= day) {
//             // Виплата всієї суми тільки після закінчення строку
//             const currentBalance = user.balance.get(currency) || 0;
//             user.balance.set(currency, currentBalance + amount + amount*percentage);
//             // 24% за весь период
//             // для 5000 6200 в конце
//           }

//           session.paidDays += daysToPay;
//           session.fullAmount += reward;
//           if (daysSinceStart >= day) {
//             session.isCompleted = true;
//           }

//           await session.save();
//           await user.save();
//         }
//       }
//     }

//     return NextResponse.json({ success: true, message: 'Баланс оновлено для користувача.' });
//   } catch (error) {
//     console.error('Помилка оновлення сесії:', error);
//     return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import ListingSession from '@/models/ListingSession';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import Operations from '@/models/Operations';


export async function PATCH(request) {
  try {
    await connectDB();

    const { userId } = await request.json();

    // Отримуємо всі активні сесії для цього користувача
    const listingSessions = await ListingSession.find({ userId, isCompleted: false });

    if (listingSessions.length === 0) {
      return NextResponse.json({ success: false, message: 'Активние сессии не найдени' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Пользователя не найдено.' });
    }

    for (const session of listingSessions) {
      const { startDate, percentage, currency, amount, paidDays, day } = session;
      const now = new Date();
      const daysSinceStart = Math.floor((now.getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
      const daysToPay = daysSinceStart - paidDays;

      if (daysToPay > 0) {
        const currentBalance = user.balance.get(currency) || 0;

        if (amount > 25000) {
          // Нарахування відсотків кожного дня
          const dailyReward = (amount * (percentage / 100));
          const totalReward = dailyReward * daysToPay;

          // Додаємо на баланс кожного дня
          user.balance.set(currency, currentBalance + totalReward);
          session.fullAmount += totalReward;

          for (let i = 0; i < daysToPay; ++i) {
            // const operationDate = new Date(startDate.getTime() + (paidDays + i + 1) * 24 * 60 * 60 * 1000);
            const newOperation = new Operations({
              id: userId,
              description: `Пришло с листинга`,
              amount: dailyReward,
              currency: "USDT",
              type: 'listing',
              createdAt: new Date(),
            });
            await newOperation.save();
          }

        } else if (daysSinceStart >= day) {
          // Виплата всієї суми одним платежем після закінчення терміну
          const totalPayout = amount + (amount * (percentage / 100));
          user.balance.set(currency, currentBalance + totalPayout);
          session.fullAmount = currentBalance + totalPayout

          const newOperation = new Operations({
            id: userId,
            description: `Пришло с листинга`,
            amount: totalPayout,
            currency: "USDT",
            type: 'listing',
            createdAt: new Date(),
          });
          await newOperation.save();
        }

        // Оновлення сесії
        session.paidDays += daysToPay;
        if (daysSinceStart >= day) {
          session.isCompleted = true;
        }

        await session.save();
      }
    }
    await user.save();

    return NextResponse.json({ success: true, message: 'Баланс обновлен.' });
  } catch (error) {
    console.error('Помилка оновлення сесії:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}
