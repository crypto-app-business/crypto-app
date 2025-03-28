import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Bonus from '@/models/Bonus';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId є обов’язковим.' }, { status: 400 });
    }

    const userBonus = await Bonus.findOne({ id: userId });

    return NextResponse.json({ success: true, bonus: userBonus });
  } catch (error) {
    console.error('Помилка отримання майнінг-сесій:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}