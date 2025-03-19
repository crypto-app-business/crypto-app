import { NextResponse } from 'next/server';
import Withdrawal from '@/models/Withdrawal';
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

    // Отримання всіх депозитів для конкретного userId
    const withdrawals = await Withdrawal.find({ id: userId });

    return NextResponse.json(
      { success: true, withdrawals },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json(
      { error: 'Помилка сервера' },
      { status: 500 }
    );
  }
}
