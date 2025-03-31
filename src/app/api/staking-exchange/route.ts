import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import Operations from '@/models/Operations';

const EXCHANGE_RATE = 10; // Приклад: 1 USDT = 10 CC

export async function POST(request) {
  try {
    const { userId, amount, fromCurrency, toCurrency } = await request.json();
    if (!userId || !amount || !fromCurrency || !toCurrency) {
      return NextResponse.json({ error: 'Усі поля обов’язкові.' }, { status: 400 });
    }

    await connectDB();

    // Знаходимо користувача
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Користувач не знайдений.' }, { status: 404 });
    }

    // Перевіряємо баланс користувача
    const fromBalance = user.balance.get(fromCurrency) || 0;
    if (fromBalance < amount) {
      return NextResponse.json({ error: 'Недостатньо коштів для обміну.' }, { status: 400 });
    }

    // Розрахунок обміну
    let exchangedAmount;
    if (fromCurrency === 'CC' && toCurrency === 'USDT') {
      exchangedAmount = amount / EXCHANGE_RATE;
      const newOperation = new Operations({
        id: userId,
        description: `Пополнение баланса`,
        amount: amount,
        currency: "USDT",
        type: 'staking',
        createdAt: new Date(),
      });
      await newOperation.save();

      const newOperation2 = new Operations({
        id: userId,
        description: `Снятие баланса`,
        amount: amount,
        currency: "CC",
        type: 'staking',
        createdAt: new Date(),
      });
      await newOperation2.save();
    } else if (fromCurrency === 'USDT' && toCurrency === 'CC') {
      exchangedAmount = amount * EXCHANGE_RATE;
      const newOperation = new Operations({
        id: userId,
        description: `Снятие баланса`,
        amount: amount,
        currency: "USDT",
        type: 'staking',
        createdAt: new Date(),
      });
      await newOperation.save();

      const newOperation2 = new Operations({
        id: userId,
        description: `Пополнение баланса`,
        amount: amount*10,
        currency: "CC",
        type: 'staking',
        createdAt: new Date(),
      });
      await newOperation2.save();
    } else {
      return NextResponse.json({ error: 'Некоректна пара валют.' }, { status: 400 });
    }

    // Оновлення балансу через Map
    user.balance.set(fromCurrency, fromBalance - amount);
    user.balance.set(toCurrency, (user.balance.get(toCurrency) || 0) + exchangedAmount);
    
    await user.save();

    return NextResponse.json({ success: true, newBalance: Object.fromEntries(user.balance) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}
