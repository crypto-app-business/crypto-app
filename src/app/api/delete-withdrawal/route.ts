import { NextResponse } from 'next/server';
import Withdrawal from '@/models/Withdrawal';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import Operations from '@/models/Operations';


export async function POST(request: Request) {
  try {
    const { depositId, userId, adminId } = await request.json();
    if (!depositId || !userId || !adminId) {
      return NextResponse.json(
        { error: 'Withdrawal  ID and User ID are required' },
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
    const deposit = await Withdrawal.findById(depositId);
    if (!deposit) {
      return NextResponse.json({ error: 'Withdrawal  not found' }, { status: 404 });
    }

    if (deposit.status !== 'pending') {
      return NextResponse.json({ error: 'Withdrawal  is already confirmed' }, { status: 400 });
    }

    // Отримання користувача
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Оновлення статусу поповнення
    deposit.status = 'delete';
    await deposit.save();

    const newOperation = new Operations({
      id: userId,
      description: `Снятие баланса не подтвержден`,
      amount: deposit.amount,
      currency: "USDT",
      type: 'deposit',
      createdAt: new Date(),
    });
    await newOperation.save();

    return NextResponse.json({ success: true, message: 'Delete  confirmed' }, { status: 200 });
  } catch (error) {
    console.error('Error confirming deposit:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
