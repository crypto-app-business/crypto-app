// /api/nft-session/closed
import { NextResponse } from 'next/server';
import NFTSession from '@/models/NFTSessionSchema';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId є обов’язковим параметром.' }, { status: 400 });
    }

    await connectDB();

    // Перевірка користувача
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Користувач не знайдений.' }, { status: 404 });
    }

    // Отримання завершених NFT-сесій (isCompleted: true)
    const closedSessions = await NFTSession.find({ userId, isCompleted: true }).lean();

    return NextResponse.json({ success: true, sessions: closedSessions });
  } catch (error) {
    console.error('Помилка при отриманні завершених NFT-сесій:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}