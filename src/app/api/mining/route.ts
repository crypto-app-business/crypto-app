import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import Withdrawal from "@/models/Withdrawal";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { userId, currency, amount, walletAddress } = await request.json();

    // Валідація вхідних даних
    if (!userId || !currency || !amount || !walletAddress) {
      return NextResponse.json(
        { error: "Всі поля (userId, currency, amount, walletAddress) є обов’язковими." },
        { status: 400 }
      );
    }

    // Отримуємо користувача з бази
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "Користувач не знайдений." }, { status: 404 });
    }

    // Перевіряємо, чи є така валюта у балансі користувача
    if (!user.balance.has(currency)) {
      return NextResponse.json({ error: "Ця криптовалюта відсутня на балансі." }, { status: 400 });
    }

    const currentBalance = user.balance.get(currency);

    // Перевіряємо, чи вистачає грошей
    if (currentBalance < amount) {
      return NextResponse.json({ error: "Недостатньо коштів." }, { status: 400 });
    }

    // Оновлюємо баланс
    user.balance.set(currency, currentBalance - amount);
    await user.save();

    // Створюємо запис про вивід
    const withdrawal = new Withdrawal({
      userId,
      currency,
      amount,
      walletAddress,
      status: "pending",
      createdAt: new Date(),
    });

    await withdrawal.save();

    return NextResponse.json(
      { success: true, message: "Запит на виведення створено успішно.", withdrawalId: withdrawal._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Помилка виведення коштів:", error);
    return NextResponse.json({ error: "Помилка сервера." }, { status: 500 });
  }
}
