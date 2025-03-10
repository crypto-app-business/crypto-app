import { NextResponse } from 'next/server';
import User from '@/models/User';
import Transfer from '@/models/Transfer'; // Імпортуємо нову модель Transfer
import connectDB from '@/utils/connectDB';
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");

interface TransferRequest {
  userId: string; // Відправник
  username: string; // Одержувач
  amount: number;
  currency: string;
}

export async function POST(request: Request) {
  try {
    const { userId, username, amount, currency }: TransferRequest = await request.json();

    if (!userId || !username || !amount || !currency) {
      return NextResponse.json(
        { error: 'userId, username, amount, currency - обов’язкові' },
        { status: 400 }
      );
    }

    await connectDB();

    // Знаходимо відправника
    const sender = await User.findById(userId);
    if (!sender) {
      return NextResponse.json({ error: 'Відправник не знайдений' }, { status: 404 });
    }

    // Перевіряємо баланс у відправника
    const senderBalance = sender.balance.get(currency) || 0;
    if (senderBalance < amount) {
      return NextResponse.json({ error: 'Недостатньо коштів' }, { status: 400 });
    }

    // Знаходимо одержувача за username
    const receiver = await User.findOne({ username });
    if (!receiver) {
      return NextResponse.json({ error: 'Одержувач не знайдений' }, { status: 404 });
    }

    // Створюємо запис про трансфер зі статусом 'pending'
    const transfer = new Transfer({
      id: userId, // ID відправника
      username: receiver.username, // Username одержувача
      currency,
      amount,
      status: 'pending',
      createdAt: new Date(),
    });

    await transfer.save();

    // Відправляємо сповіщення адміну в Telegram
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (adminChatId) {
      const message = `
Новий трансфер створено:
ID: ${transfer._id}
Відправник: ${sender.username}
Одержувач: ${receiver.username}
Валюта: ${currency}
Сума: ${amount}
Статус: ${transfer.status}
Дата: ${new Date(transfer.createdAt).toLocaleString()}
      `;
      await bot.telegram.sendMessage(adminChatId, message);
    } else {
      console.warn("TELEGRAM_ADMIN_CHAT_ID не вказано");
    }

    return NextResponse.json(
      { success: true, message: 'Трансфер створено, чекає на підтвердження', transferId: transfer._id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Помилка створення трансферу:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}

// Отримання всіх трансферів зі статусом 'pending'
export async function GET() {
  try {
    await connectDB();
    const transfers = await Transfer.find({ status: 'pending' });
    return NextResponse.json({ success: true, transfers }, { status: 200 });
  } catch (error) {
    console.error('Помилка отримання трансферів:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}