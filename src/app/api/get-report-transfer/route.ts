import { NextResponse } from 'next/server';
import Transfer from '@/models/Transfer';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';

export async function GET(request: Request) {
  try {
    // Отримуємо userId з параметрів запиту
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Перевіряємо, чи передано userId
    if (!userId) {
      return NextResponse.json(
        { error: 'Необхідно передати userId' },
        { status: 400 }
      );
    }

    // Підключення до бази даних
    await connectDB();

    // Знаходимо користувача за userId
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Користувача не знайдено' },
        { status: 404 }
      );
    }

    // Отримуємо транзакції, які користувач відправив (де id дорівнює userId)
    const sentTransfers = await Transfer.find({ id: userId });

    // Отримуємо транзакції, які були відправлені користувачу (де username дорівнює username користувача)
    const receivedTransfers = await Transfer.find({ username: user.username });

    // Формуємо відповідь із двома масивами
    const response = {
      success: true,
      sentTransfers, // Транзакції, які користувач відправив
      receivedTransfers, // Транзакції, які користувач отримав
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching transfers:', error);
    return NextResponse.json(
      { error: 'Помилка сервера' },
      { status: 500 }
    );
  }
}