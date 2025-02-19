import { NextResponse } from 'next/server';
import Wallets from '@/models/Wallets';
import connectDB from '@/utils/connectDB';

interface WalletRequest {
  id: string;
  network: string;
  wallet: string;
}

// Обробник POST-запиту (додавання нового гаманця)
export async function POST(request: Request) {
  try {
    const { id, network, wallet }: WalletRequest = await request.json();

    if (!id || !network || !wallet) {
      return NextResponse.json(
        { error: 'Всі поля обов’язкові: id, network, wallet' },
        { status: 400 }
      );
    }

    await connectDB();

    const newWallet = new Wallets({
      id,
      network,
      wallet,
      createdAt: new Date(),
    });

    await newWallet.save();

    return NextResponse.json(
      { success: true, message: 'Гаманець успішно додано', walletId: newWallet._id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Помилка при додаванні гаманця:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}

// Обробник GET-запиту (отримання всіх гаманців користувача)
export async function GET(request: Request) {
  try {
    // Отримуємо параметри запиту
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Необхідний параметр id користувача' },
        { status: 400 }
      );
    }

    await connectDB();

    // Знаходимо всі гаманці, які належать користувачу
    const wallets = await Wallets.find({ id: userId });

    return NextResponse.json({ success: true, wallets }, { status: 200 });
  } catch (error) {
    console.error('Помилка при отриманні гаманців:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}