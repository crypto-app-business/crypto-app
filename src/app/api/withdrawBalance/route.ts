import { NextResponse } from 'next/server';
import Withdrawal from '@/models/Withdrawal';
import User from "@/models/User";
import connectDB from '@/utils/connectDB';
import { Telegraf } from 'telegraf';


// Ініціалізація бота (токен із .env)
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");


interface WithdrawalRequest {
  id: string;
  currency: string;
  amount: number;
  waletId: string;
}

export async function POST(request: Request) {
  try {
    // Парсимо тіло запиту
    const { id, currency, amount, waletId }: WithdrawalRequest = await request.json();

    // Валідація вхідних даних
    if (!id || !currency || !amount || !waletId) {
      return NextResponse.json(
        { error: 'Всі поля є обов’язковими: id, currency, amount, waletId' },
        { status: 400 }
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "Користувач не знайдений." }, { status: 404 });
    }

    const currentBalance = user.balance.get('USDT');

    if (currentBalance < amount) {
      return NextResponse.json({ error: "Недостатньо коштів." }, { status: 400 });
    }

    // Мінімальні суми для кожної валюти
    const minAmounts: Record<string, number> = {
      USDT: 10,
      ETH: 0.01,
      BTC: 0.0001,
    };

    if (amount < (minAmounts[currency] || 0)) {
      return NextResponse.json(
        { error: `Мінімальна сума для ${currency}: ${minAmounts[currency]}` },
        { status: 400 }
      );
    }

    // Підключення до бази даних
    await connectDB();

    console.log(waletId)
    // Створюємо запит на вивід коштів
    const withdrawal = new Withdrawal({
      id,
      currency,
      amount,
      waletId,
      status: 'pending', // Початковий статус "очікує підтвердження"
      createdAt: new Date(),
    });

    // Збереження запиту у базі даних
    await withdrawal.save();

    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (adminChatId) {
      const message = `
Нове виведення створено:
ID: ${withdrawal._id}
Користувач: ${id}
Email: ${user.email}
Валюта: ${currency}
Сума: ${amount} USD
Статус: ${withdrawal.status}
Гаманець: ${waletId}
Дата: ${new Date(withdrawal.createdAt).toLocaleString()}
  `;
      await bot.telegram.sendMessage(adminChatId, message);
    } else {
      console.warn("TELEGRAM_ADMIN_CHAT_ID нет");
    }

    return NextResponse.json(
      { success: true, message: 'Запрос на вывод денег создан успешно', withdrawalId: withdrawal._id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
