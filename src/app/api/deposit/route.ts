import { NextResponse } from 'next/server';
import { Telegraf } from 'telegraf';
import Deposit from '@/models/Deposit';
import User from '@/models/Deposit';
import connectDB from '@/utils/connectDB';

// Ініціалізація бота (токен із .env)
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");

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

    // Підключення до бази даних
    await connectDB();

    // Створення нового поповнення
    const deposit = new Deposit({
      id,
      currency,
      amount,
      status: 'pending',
      createdAt: new Date(),
    });

    // Збереження поповнення у базі даних
    await deposit.save();

    const user = await User.findById(id);;

    // Відправка сповіщення адміну
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (adminChatId) {
      const message = `
Новий депозит створено:
ID: ${deposit._id}
Користувач: ${id}
Email: ${user.email}
Валюта: ${currency}
Сума: ${amount} USD
Статус: ${deposit.status}
Дата: ${new Date(deposit.createdAt).toLocaleString()}
      `;
      await bot.telegram.sendMessage(adminChatId, message);
    } else {
      console.warn("TELEGRAM_ADMIN_CHAT_ID нет");
    }

    return NextResponse.json(
      { success: true, message: 'Пополнения создано успешно', depositId: deposit._id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating deposit:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}