import { NextResponse } from 'next/server';
import Deposit from '@/models/Deposit';
import connectDB from '@/utils/connectDB';


export async function GET() {
  try {
    // Підключення до бази даних
    await connectDB();

    // Отримання всіх поповнень зі статусом "pending"
    const deposits = await Deposit.find({ status: 'pending' });

    return NextResponse.json({ success: true, deposits }, { status: 200 });
  } catch (error) {
    console.error('Error fetching deposits:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
