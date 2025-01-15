import { NextResponse } from 'next/server';
import MiningSession from '@/models/MiningSession';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';

export async function PATCH(request) {
  try {
    await connectDB();
    
    const { userId } = await request.json();

    // Перевіряємо, чи користувач є адміністратором
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: 'Недостатньо прав.' }, { status: 403 });
    }

    // Зміщуємо дати для всіх майнінг-контрактів
    const sessions = await MiningSession.find({});
    const oneDayInMs = 24 * 60 * 60 * 1000 * 7;
    console.log(sessions)
    for (const session of sessions) {
      session.startDate = new Date(session.startDate.getTime() - oneDayInMs);
      session.endDate = new Date(session.endDate.getTime() - oneDayInMs);
      if (session.lastPaymentDate) {
        session.lastPaymentDate = new Date(session.lastPaymentDate.getTime() - oneDayInMs);
      }
      await session.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Дати зміщено на один день назад.',
      modifiedCount: sessions.length,
    });
  } catch (error) {
    console.error('Помилка зміщення дат:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}