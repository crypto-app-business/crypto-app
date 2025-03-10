import { NextResponse } from 'next/server';
import Transfer from '@/models/Transfer';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import Operations from '@/models/Operations';

export async function POST(request: Request) {
  try {
    const { transferId, userId, adminId } = await request.json();
    if (!transferId || !userId || !adminId) {
      return NextResponse.json(
        { error: 'Transfer ID, User ID, and Admin ID are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Отримання адміністратора
    const adminUser = await User.findOne({ _id: adminId });
    if (adminUser?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. User is not an administrator.' },
        { status: 403 }
      );
    }

    // Отримання трансферу
    const transfer = await Transfer.findById(transferId);
    if (!transfer) {
      return NextResponse.json({ error: 'Transfer not found' }, { status: 404 });
    }

    if (transfer.status !== 'pending') {
      return NextResponse.json({ error: 'Transfer is already processed' }, { status: 400 });
    }

    // Оновлення статусу трансферу
    transfer.status = 'rejected'; // Використовуємо 'rejected' замість 'delete' для консистентності
    await transfer.save();

    // Створення операції для відправника
    const senderOperation = new Operations({
      id: userId,
      description: `Трансфер до ${transfer.username} не підтверджено`,
      amount: transfer.amount,
      currency: transfer.currency,
      type: 'transfer',
      createdAt: new Date(),
    });
    await senderOperation.save();

    return NextResponse.json({ success: true, message: 'Transfer rejected' }, { status: 200 });
  } catch (error) {
    console.error('Error rejecting transfer:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}