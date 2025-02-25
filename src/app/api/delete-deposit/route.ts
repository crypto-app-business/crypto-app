import { NextResponse } from 'next/server';
import Deposit from '@/models/Deposit';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import Operations from '@/models/Operations';


export async function POST(request: Request) {
  try {
    const { depositId, userId, adminId } = await request.json();
    if (!depositId || !userId || !adminId) {
      return NextResponse.json(
        { error: 'Deposit ID and User ID are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Отримання адміністратора
    const adminUser = await User.findOne({ _id: adminId });

    if (adminUser?.role !=='admin') {
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

    // Оновлення статусу поповнення
    deposit.status = 'delete';
    await deposit.save();

    const newOperation = new Operations({
      id: userId,
      description: `Пополнение не подтверждено`,
      amount: deposit.amount,
      currency: "USDT",
      type: 'deposit',
      createdAt: new Date(),
    });
    await newOperation.save();
    return NextResponse.json({ success: true, message: 'Deposit confirmed' }, { status: 200 });
  } catch (error) {
    console.error('Error confirming deposit:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
