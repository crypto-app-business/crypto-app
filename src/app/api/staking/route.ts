import { NextResponse } from 'next/server';
import StakingSession from '@/models/StakingSession';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';

// export async function POST(request) {
//   console.log("la")
//   try {
//     const { userId, currency, amount } = await request.json();
//     if (!userId || !currency || !amount) {
//       return NextResponse.json({ error: 'Усі поля обов’язкові.' }, { status: 400 });
//     }

//     await connectDB();

//     const user = await User.findById(userId);
//     if (!user) {
//       return NextResponse.json({ error: 'Користувач не знайдений.' }, { status: 404 });
//     }

//     if (!user.balance.has(currency)) {
//       return NextResponse.json({ error: 'Ця криптовалюта відсутня на балансі.' }, { status: 400 });
//     }
    
//     const currentBalance = user.balance.get(currency);
//     if (currentBalance < amount) {
//       return NextResponse.json({ error: 'Недостатньо коштів.' }, { status: 400 });
//     }
    
//     // Оновлюємо баланс
//     user.balance.set(currency, currentBalance - amount);
//     await user.save();

//     const newSession = await StakingSession.create({
//       userId,
//       currency,
//       amount,
//       startDate: new Date(),
//     });

//     return NextResponse.json({ success: true, data: newSession });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
//   }
// }

export async function POST(request) {
  try {
    const { userId, currency, amount } = await request.json();
    if (!userId || !currency || !amount) {
      return NextResponse.json({ error: 'Усі поля обов’язкові.' }, { status: 400 });
    }

    await connectDB();

    // Знаходимо користувача
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден.' }, { status: 404 });
    }

    if (!user.balance.has(currency)) {
      return NextResponse.json({ error: 'Єта криптовалюта отсуствует на балансе.' }, { status: 400 });
    }

    const currentBalance = user.balance.get(currency);
    if (currentBalance < amount) {
      return NextResponse.json({ error: 'Недостаточно денег.' }, { status: 400 });
    }

    // Віднімаємо суму з балансу користувача
    user.balance.set(currency, currentBalance - amount);
    await user.save();

    // Перевіряємо, чи існує активна сесія стейкінгу для цієї криптовалюти
    let stakingSession = await StakingSession.findOne({ userId, currency, isCompleted: false });

    if (stakingSession) {
      // Якщо існує, додаємо нову суму до існуючої
      stakingSession.amount += amount;
      await stakingSession.save();
    } else {
      // Якщо ні, створюємо нову сесію
      stakingSession = await StakingSession.create({
        userId,
        currency,
        amount,
        startDate: new Date(),
      });
    }

    return NextResponse.json({ success: true, data: stakingSession });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId є обов’язковим.' }, { status: 400 });
    }

    const userSessions = await StakingSession.find({ userId, isCompleted: false });
    
    return NextResponse.json({ success: true, sessions: userSessions });
  } catch (error) {
    console.error('Помилка отримання стейкінг-сесій:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}