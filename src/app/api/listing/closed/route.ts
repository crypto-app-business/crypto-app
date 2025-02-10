import { NextResponse } from 'next/server';
import ListingSession from '@/models/ListingSession';
import connectDB from '@/utils/connectDB';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId є обов’язковим.' }, { status: 400 });
    }

    const userSessions = await ListingSession.find({ userId, isCompleted: true });
    
    return NextResponse.json({ success: true, sessions: userSessions });
  } catch (error) {
    console.error('Помилка отримання майнінг-сесій:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}