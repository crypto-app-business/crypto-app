import { NextResponse } from 'next/server';
import MiningSession from '@/models/MiningSession';
import connectDB from '@/utils/connectDB';

export async function POST(request) {
    try {
      const { sessionId } = await request.json();
  
      if (!sessionId) {
        return NextResponse.json({ error: 'ID сесії є обов’язковим.' }, { status: 400 });
      }
  
      await connectDB();
  
      const session = await MiningSession.findById(sessionId).populate('userId');
      if (!session) {
        return NextResponse.json({ error: 'Сесія не знайдена.' }, { status: 404 });
      }
  
      if (new Date() < session.endDate) {
        return NextResponse.json({ error: 'Майнінг ще не завершено.' }, { status: 400 });
      }
  
      if (session.isCompleted) {
        return NextResponse.json({ error: 'Майнінг вже завершено.' }, { status: 400 });
      }
  
      // Розрахунок прибутку
      let profit = 0;
      for (let i = 0; i < session.week; i++) {
        profit += session.amount * (session.percentage[i] / 100);
      }
  
      // Додавання прибутку до балансу
      const user = session.userId;
      user.balance[session.currency] = (user.balance[session.currency] || 0) + profit;
      await user.save();
  
      // Оновлення сесії
      session.isCompleted = true;
      await session.save();
  
      return NextResponse.json({
        success: true,
        data: { profit, balance: user.balance },
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
    }
}
  