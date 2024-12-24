import { NextResponse } from 'next/server';
import Deposit from '@/models/Deposit';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';


export async function POST(request: Request) {
  try {
    const { depositId, userId } = await request.json();
    console.log(depositId, userId)
    if (!depositId || !userId) {
      return NextResponse.json(
        { error: 'Deposit ID and User ID are required' },
        { status: 400 }
      );
    }

    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB.');

    // Отримання адміністратора
    const adminUser = await User.findOne({ _id: userId });
    console.log(adminUser)
    console.log(adminUser)
    if (!adminUser || !adminUser?.role) {
      return NextResponse.json(
        { error: 'Access denied. User is not an administrator.' },
        { status: 403 }
      );
    }

    // Отримання поповнення
    const deposit = await Deposit.findById(depositId);
    if (!deposit) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
    }

    if (deposit.status !== 'pending') {
      return NextResponse.json({ error: 'Deposit is already confirmed' }, { status: 400 });
    }

    // Отримання користувача
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User before updating balance:', user);

    // Оновлення балансу
    user.balance.set(deposit.currency, (user.balance.get(deposit.currency) || 0) + deposit.amount);

    // Зберігаємо користувача без змін інших полів
    await user.save();

    // Оновлення статусу поповнення
    deposit.status = 'confirmed';
    await deposit.save();

    return NextResponse.json({ success: true, message: 'Deposit confirmed' }, { status: 200 });
  } catch (error) {
    console.error('Error confirming deposit:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
