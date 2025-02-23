import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import Operations from '@/models/Operations';


interface TransferRequest {
  userId: string; // Відправник
  receiverUsername: string; // Одержувач
  amount: number;
  currency: string;
}

export async function POST(request: Request) {
  try {
    // Парсимо запит
    const { userId, receiverUsername, amount, currency }: TransferRequest = await request.json();

    if (!userId || !receiverUsername || !amount || !currency) {
      return NextResponse.json(
        { error: 'userId, receiverUsername, amount, currency - обов’язкові' },
        { status: 400 }
      );
    }

    await connectDB();

    // Знаходимо відправника
    const sender = await User.findById(userId);
    if (!sender) {
      return NextResponse.json({ error: 'Відправник не знайдений' }, { status: 404 });
    }

    // Перевіряємо баланс у відправника
    const senderBalance = sender.balance.get(currency) || 0;
    if (senderBalance < amount) {
      return NextResponse.json({ error: 'Недостатньо коштів' }, { status: 400 });
    }

    // Знаходимо одержувача за username
    const receiver = await User.findOne({ username: receiverUsername });
    if (!receiver) {
      return NextResponse.json({ error: 'Одержувач не знайдений' }, { status: 404 });
    }

    // Виконуємо трансфер
    sender.balance.set(currency, senderBalance - amount);
    receiver.balance.set(currency, (Number(receiver.balance.get(currency)) || 0) + +amount);

    const newOperationSender = new Operations({
      id: userId,
      description: `Отправлено юзеру ${receiver.username}`,
      amount: amount,
      currency: "USDT",
      type: 'transfer',
      createdAt: new Date(),
    });
    await newOperationSender.save();

    const newOperationReceiver = new Operations({
      id: receiver.id,
      description: `Получено от ${sender.username}`,
      amount: amount,
      currency: "USDT",
      type: 'transfer',
      createdAt: new Date(),
    });
    await newOperationReceiver.save();

    // Зберігаємо оновлені баланси
    await sender.save();
    await receiver.save();

    return NextResponse.json(
      { success: true, message: `Трансфер ${amount} ${currency} відправлено до ${receiver.username}` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Помилка трансферу:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
