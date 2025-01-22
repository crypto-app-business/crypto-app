import { NextResponse } from 'next/server';
// import { type NextRequest } from 'next/server';
import connectDB from '@/utils/connectDB';
import StakingSession from '@/models/StakingSession';
import logger from '@/utils/logger';

export async function POST() {
// export async function POST(request: NextRequest) {
  // const secretKey = request.headers.get('x-secret-key');
  
  // Перевірка секретного ключа
  // if (!secretKey || secretKey !== process.env.STAKING_SECRET_KEY) {
  //   logger.error('Unauthorized access attempt');
  //   return NextResponse.json(
  //     { error: 'Доступ заборонено.' },
  //     { status: 403 }
  //   );
  // }

  try {
    await connectDB();

    const sessions = await StakingSession.find({});
    for (const session of sessions) {
      const profit = session.amount * 0.003; // 0.3% від суми
      session.amount += profit;
      session.fullAmount += profit;
      await session.save();
    }

    logger.info('Database successfully updated');
    return NextResponse.json(
      { success: true, message: 'База даних оновлена успішно.' },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error updating database: ${error}`);
    return NextResponse.json(
      { error: 'Помилка сервера.' },
      { status: 500 }
    );
  }
}