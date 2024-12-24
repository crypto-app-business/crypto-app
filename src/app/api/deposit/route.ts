import { NextResponse } from 'next/server';
import Deposit from '@/models/Deposit';
import connectDB from '@/utils/connectDB';

interface DepositRequest {
  id: string;
  currency: string;
  amount: number;
}

export async function POST(request: Request) {
  try {
    // Парсимо тіло запиту
    const { id, currency, amount }: DepositRequest = await request.json();

    // Валідація вхідних даних
    if (!id || !currency || !amount) {
      return NextResponse.json(
        { error: 'Всі поля є обов’язковими: id, currency, amount' },
        { status: 400 }
      );
    }

    // Мінімальні суми для кожної валюти
    const minAmounts: Record<string, number> = {
      USDT: 10,
      ETH: 1,
      BTC: 0.001,
    };

    if (amount < (minAmounts[currency] || 0)) {
      return NextResponse.json(
        { error: `Мінімальна сума для ${currency}: ${minAmounts[currency]}` },
        { status: 400 }
      );
    }

    // Підключення до бази даних
    await connectDB();

    // Створення нового поповнення
    const deposit = new Deposit({
      id,
      currency,
      amount,
      status: 'pending', // Початковий статус "очікує підтвердження"
      createdAt: new Date(),
    });

    // Збереження поповнення у базі даних
    await deposit.save();

    return NextResponse.json(
      { success: true, message: 'Поповнення створено успішно', depositId: deposit._id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating deposit:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
