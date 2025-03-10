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

    // Отримання відправника
    const sender = await User.findById(userId);
    if (!sender) {
      return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
    }

    // Отримання одержувача
    const receiver = await User.findOne({ username: transfer.username });
    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
    }

    // Перевірка балансу відправника
    const senderBalance = sender.balance.get(transfer.currency) || 0;
    if (senderBalance < transfer.amount) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
    }

    // Оновлення балансів
    sender.balance.set(transfer.currency, senderBalance - transfer.amount);
    receiver.balance.set(transfer.currency, (receiver.balance.get(transfer.currency) || 0) + transfer.amount);

    // Збереження змін у відправника та одержувача
    await Promise.all([sender.save(), receiver.save()]);

    // Оновлення статусу трансферу
    transfer.status = 'confirmed';
    await transfer.save();

    // Створення операцій
    const senderOperation = new Operations({
      id: userId,
      description: `Отправлено юзеру ${receiver.username}`,
      amount: transfer.amount,
      currency: transfer.currency,
      type: 'transfer',
      createdAt: new Date(),
    });

    const receiverOperation = new Operations({
      id: receiver._id,
      description: `Получено от ${sender.username}`,
      amount: transfer.amount,
      currency: transfer.currency,
      type: 'transfer',
      createdAt: new Date(),
    });

    await Promise.all([senderOperation.save(), receiverOperation.save()]);

    return NextResponse.json({ success: true, message: 'Transfer confirmed' }, { status: 200 });
  } catch (error) {
    console.error('Error confirming transfer:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}