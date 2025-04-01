// /api/nft-session
import { NextResponse } from 'next/server';
import NFT from '@/models/NFTSchema';
import NFTSession from '@/models/NFTSessionSchema';
import User from '@/models/User';
import Operations from '@/models/Operations';
import connectDB from '@/utils/connectDB';

export async function POST(request) {
  try {
    const { userId, nftId, currency } = await request.json();

    if (!userId || !nftId || !currency) {
      return NextResponse.json({ error: 'Всеполя обязательны.' }, { status: 400 });
    }

    await connectDB();

    // Перевірка користувача
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден.' }, { status: 404 });
    }

    // Перевірка NFT
    const nft = await NFT.findById(nftId);
    if (!nft) {
      return NextResponse.json({ error: 'NFT не найден.' }, { status: 404 });
    }

    // Перевірка, чи NFT ще доступний для активації
    const now = new Date();
    const daysSinceCreation = Math.floor((now.getTime() - new Date(nft.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceCreation > nft.activationDays) {
      return NextResponse.json({ error: 'NFT больше недоступен для активации' }, { status: 400 });
    }

    // Перевірка балансу
    if (!user.balance.has(currency)) {
      return NextResponse.json({ error: 'Криптовалюта отсутсвует на балансе' }, { status: 400 });
    }
    const currentBalance = user.balance.get(currency);
    if (currentBalance < nft.price) {
      return NextResponse.json({ error: 'Недостаточно денег' }, { status: 400 });
    }

    // Оновлюємо баланс
    user.balance.set(currency, currentBalance - nft.price);
    await user.save();

    // Запис операції
    const newOperation = new Operations({
      id: userId,
      description: `Покупка NFT: ${nft.name}`,
      amount: nft.price,
      currency: "USDT",
      type: 'nft',
      createdAt: new Date(),
    });
    await newOperation.save();

    // Створюємо сесію NFT
    const newSession = await NFTSession.create({
      userId,
      nftId,
      currency,
      amount: nft.price,
      percentage: nft.percentage,
      durationDays: nft.durationDays,
      startDate: new Date(),
      endDate: new Date(Date.now() + nft.durationDays * 24 * 60 * 60 * 1000),
      paidDays: 0,
    });

    return NextResponse.json({ success: true, data: newSession });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ошибка сервера.' }, { status: 500 });
  }
}

// Обробка щоденних виплат
export async function PATCH(request) {
  try {
    await connectDB();

    const { userId } = await request.json();

    // Отримуємо всі активні сесії для цього користувача
    const nftSessions = await NFTSession.find({ userId, isCompleted: false });

    if (nftSessions.length === 0) {
      return NextResponse.json({ success: false, message: 'Нет активных сессий.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Пользователь не найден.' });
    }

    for (const session of nftSessions) {
      const { startDate, percentage, currency, amount, paidDays, durationDays } = session;
      const now = new Date();
      const daysSinceStart = Math.floor((now.getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
      const daysToPay = daysSinceStart - paidDays;

      if (daysToPay > 0) {
        const currentBalance = user.balance.get(currency) || 0;

        // Нарахування щоденних відсотків
        const dailyReward = (amount * (percentage / 100)) / durationDays;
        const totalReward = dailyReward * daysToPay;

        // Додаємо на баланс щоденні виплати
        user.balance.set(currency, currentBalance + totalReward);
        session.totalReward += totalReward;

        for (let i = 0; i < daysToPay; i++) {
          const operationDate = new Date(startDate.getTime() + (paidDays + i + 1) * 24 * 60 * 60 * 1000);
          const newOperation = new Operations({
            id: userId,
            description: `Ежедневная выплата NFT`,
            amount: dailyReward,
            currency: "USDT",
            type: 'nft',
            createdAt: operationDate,
          });
          await newOperation.save();
        }

        // Якщо сесія завершена, повертаємо тіло
        if (daysSinceStart >= durationDays) {
          user.balance.set(currency, user.balance.get(currency) + amount);
          session.isCompleted = true;

          const returnOperation = new Operations({
            id: userId,
            description: `Возврат тела NFT`,
            amount: amount,
            currency: "USDT",
            type: 'nft',
            createdAt: new Date(),
          });
          await returnOperation.save();
        }

        // Оновлення сесії
        session.paidDays += daysToPay;
        await session.save();
      }
    }
    await user.save();

    return NextResponse.json({ success: true, message: 'Баланс обновлен.' });
  } catch (error) {
    console.error('Ошибка обновления сесии:', error);
    return NextResponse.json({ error: 'Ошибка сервера.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId є обов’язковим параметром.' }, { status: 400 });
    }

    await connectDB();

    // Перевірка користувача
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Користувач не знайдений.' }, { status: 404 });
    }

    // Отримання активних NFT-сесій (isCompleted: false)
    const activeSessions = await NFTSession.find({ userId, isCompleted: false }).lean();

    return NextResponse.json({ success: true, sessions: activeSessions });
  } catch (error) {
    console.error('Помилка при отриманні активних NFT-сесій:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}