import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';

export async function POST(request: Request) {
  try {
    // Парсимо тіло запиту
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Юзернейм обезателен' }, { status: 400 });
    }

    await connectDB();

    // Перевіряємо, чи існує користувач з таким юзернеймом
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return NextResponse.json({ isUnique: false }, { status: 200 }); // Юзернейм зайнятий
    }

    return NextResponse.json({ isUnique: true }, { status: 200 }); // Юзернейм доступний
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
