import { NextResponse } from 'next/server';
import Deposit from '@/models/Deposit';
import connectDB from '@/utils/connectDB';

export async function GET(request: Request) {
  try {
    // Підключення до бази даних
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB.');

    // Отримання параметрів із запиту
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID користувача є обов’язковим' },
        { status: 400 }
      );
    }

    // Отримання поповнень зі статусом "pending" для цього користувача
    const deposits = await Deposit.find({ id, status: 'pending' });
    console.log('Deposits fetched:', deposits);

    return NextResponse.json({ success: true, deposits }, { status: 200 });
  } catch (error) {
    console.error('Error fetching deposits:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
