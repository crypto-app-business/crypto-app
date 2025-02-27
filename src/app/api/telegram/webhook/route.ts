import { Telegraf } from "telegraf";
import { NextResponse } from "next/server";
import Deposit from "@/models/Deposit";
import Withdrawal from "@/models/Withdrawal";
import User from "@/models/User";
import connectDB from "@/utils/connectDB";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");

// З’єднуємося з базою даних при ініціалізації бота
bot.use(async (ctx, next) => {
  await connectDB();
  next();
});

// Middleware для перевірки адміна
bot.use(async (ctx, next) => {
  console.log("Chat ID:", ctx.chat?.id);
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!adminChatId) {
    await ctx.reply("Помилка: ID адміністратора не налаштовано.");
    return;
  }

  if (ctx.chat?.id.toString() !== adminChatId) {
    await ctx.reply("У вас немає прав для використання цього бота.");
    return;
  }

  next();
});

// Команда для підтвердження транзакції (Deposit або Withdrawal)
bot.command("confirm", async (ctx) => {
  try {
    const transactionId = ctx.message.text.split(" ")[1]; // Отримуємо ID транзакції, наприклад, /confirm 67bdccf9cf93e920f97b702a
    if (!transactionId) {
      await ctx.reply("Будь ласка, вкажіть ID транзакції, наприклад: /confirm 67bdccf9cf93e920f97b702a");
      return;
    }

    // Спробуємо знайти як Deposit, так і Withdrawal
    const deposit = await Deposit.findOne({ id: transactionId });
    const withdrawal = await Withdrawal.findOne({ id: transactionId });

    if (!deposit && !withdrawal) {
      await ctx.reply("Транзакція не знайдена.");
      return;
    }

    let transactionType = "Поповнення";
    const transaction = deposit || withdrawal;

    if (withdrawal) {
      transactionType = "Вивід";
    }

    if (transaction.status === "confirmed") {
      await ctx.reply(`Транзакція ${transactionId} вже підтверджена (${transactionType}).`);
      return;
    }

    if (transaction.status === "rejected") {
      await ctx.reply(`Транзакція ${transactionId} вже відхилена (${transactionType}), не можна підтвердити.`);
      return;
    }

    // Оновлюємо статус
    if (deposit) {
      deposit.status = "confirmed";
      await deposit.save();
    } else if (withdrawal) {
      withdrawal.status = "confirmed";
      await withdrawal.save();
    }

    await ctx.reply(
      `Транзакція ${transactionId} підтверджена.\nТип: ${transactionType}\nВалюта: ${transaction.currency}\nСума: ${transaction.amount} USD\nСтатус: Підтверджено`
    );
  } catch (error) {
    console.error("Error confirming transaction:", error);
    await ctx.reply("Помилка при підтвердженні транзакції.");
  }
});

// Команда для відхилення транзакції (Deposit або Withdrawal)
bot.command("reject", async (ctx) => {
  try {
    const transactionId = ctx.message.text.split(" ")[1]; // Отримуємо ID транзакції, наприклад, /reject 67bdccf9cf93e920f97b702a
    if (!transactionId) {
      await ctx.reply("Будь ласка, вкажіть ID транзакції, наприклад: /reject 67bdccf9cf93e920f97b702a");
      return;
    }

    // Спробуємо знайти як Deposit, так і Withdrawal
    const deposit = await Deposit.findOne({ id: transactionId });
    const withdrawal = await Withdrawal.findOne({ id: transactionId });

    if (!deposit && !withdrawal) {
      await ctx.reply("Транзакція не знайдена.");
      return;
    }

    let transactionType = "Поповнення";
    const transaction = deposit || withdrawal;

    if (withdrawal) {
      transactionType = "Вивід";
    }

    if (transaction.status === "rejected") {
      await ctx.reply(`Транзакція ${transactionId} вже відхилена (${transactionType}).`);
      return;
    }

    if (transaction.status === "confirmed") {
      await ctx.reply(`Транзакція ${transactionId} вже підтверджена (${transactionType}), не можна відхилити.`);
      return;
    }

    // Оновлюємо статус
    if (deposit) {
      deposit.status = "rejected";
      await deposit.save();
    } else if (withdrawal) {
      withdrawal.status = "rejected";
      await withdrawal.save();
    }

    await ctx.reply(
      `Транзакція ${transactionId} відхилена.\nТип: ${transactionType}\nВалюта: ${transaction.currency}\nСума: ${transaction.amount} USD\nСтатус: Відхилено`
    );
  } catch (error) {
    console.error("Error rejecting transaction:", error);
    await ctx.reply("Помилка при відхиленні транзакції.");
  }
});

// Команда для отримання списку всіх користувачів
bot.command("getusers", async (ctx) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 }); // Сортуємо за датою створення (новіші перші)

    if (!users.length) {
      await ctx.reply("Користувачі не знайдені.");
      return;
    }

    let response = "Список користувачів:\n\n";
    users.forEach((user, index) => {
      response += `${index + 1}. Ім’я: ${user.firstName} ${user.lastName}\n`;
      response += `   Никнейм: ${user.username}\n`;
      response += `   Email: ${user.email}\n`;
      response += `   Телефон: ${user.phone}\n`;
      response += `   Телеграм: ${user.telegramId || "-"} \n`;
      response += `   Баланс: ${Object.entries(user.balance || {}).map(([curr, amt]) => `${curr}: ${amt}`).join(", ")}\n\n`;
    });

    if (response.length > 4096) {
      response = response.substring(0, 4095) + "...";
    }

    await ctx.reply(response);
  } catch (error) {
    console.error("Error getting users:", error);
    await ctx.reply("Помилка при отриманні списку користувачів.");
  }
});

// Нова команда для отримання списку депозитів
bot.command("getdeposits", async (ctx) => {
  try {
    // Підключення до бази даних
    await connectDB();

    // Шукаємо депозити зі статусом "pending"
    const deposits = await Deposit.find({ status: "pending" });

    // Якщо депозитів немає
    if (!deposits.length) {
      await ctx.reply("Депозити зі статусом 'pending' не знайдені.");
      return;
    }

    // Формуємо список
    let response: string = "Список депозитів (pending):\n\n"; // Явно вказуємо тип string
    const messages: string[] = []; // Явно вказуємо, що messages — це масив рядків

    deposits.forEach((deposit, index) => {
      const depositInfo: string = `${index + 1}. ID: ${deposit.id}\n` +
                                 `   Валюта: ${deposit.currency}\n` +
                                 `   Сума: ${deposit.amount} USD\n` +
                                 `   Статус: ${deposit.status}\n` +
                                 `   Дата: ${new Date(deposit.createdAt).toLocaleString()}\n\n`;

      // Перевіряємо, чи не перевищує поточне повідомлення ліміт у 4096 символів
      if (response.length + depositInfo.length > 4096) {
        messages.push(response); // Додаємо поточний текст у масив
        response = "Список депозитів (продовження):\n\n" + depositInfo; // Починаємо новий блок
      } else {
        response += depositInfo; // Додаємо до поточного тексту
      }
    });

    // Додаємо останню частину, якщо вона не порожня
    if (response.length > 0) {
      messages.push(response);
    }

    // Надсилаємо всі частини повідомлення
    for (const message of messages) {
      await ctx.reply(message);
    }

  } catch (error) {
    console.error("Error getting deposits:", error);
    await ctx.reply("Помилка при отриманні списку депозитів.");
  }
});

// Нова команда для отримання списку виведень
bot.command("getwithdrawals", async (ctx) => {
  try {
    const withdrawals = await Withdrawal.find()
      .sort({ createdAt: -1 }); // Сортуємо за датою створення (новіші перші)

    if (!withdrawals.length) {
      await ctx.reply("Виведення не знайдені.");
      return;
    }

    let response = "Список виведень:\n\n";
    withdrawals.forEach((withdrawal, index) => {
      response += `${index + 1}. ID: ${withdrawal.id}\n`;
      response += `   Валюта: ${withdrawal.currency}\n`;
      response += `   Сума: ${withdrawal.amount} USD\n`;
      response += `   Статус: ${withdrawal.status}\n`;
      response += `   Гаманець: ${withdrawal.waletId}\n`;
      response += `   Дата: ${new Date(withdrawal.createdAt).toLocaleString()}\n\n`;
    });

    if (response.length > 4096) {
      response = response.substring(0, 4095) + "...";
    }

    await ctx.reply(response);
  } catch (error) {
    console.error("Error getting withdrawals:", error);
    await ctx.reply("Помилка при отриманні списку виведень.");
  }
});

// Налаштування вебхука для Next.js API
export async function POST(req: Request) {
  const body = await req.json();
  await bot.handleUpdate(body);
  return NextResponse.json({ status: "ok" });
}

// Налаштування вебхука (викликати один раз через GET)
export async function GET() {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const webhookUrl = `${process.env.VERCEL_URL}/api/telegram/webhook`; // Замініть на ваш домен або IP (наприклад, https://5.11.83.121/api/telegram/webhook)

    if (!botToken) {
      return NextResponse.json({ error: "Telegram bot token is missing" }, { status: 500 });
    }

    await bot.telegram.setWebhook(webhookUrl);
    return NextResponse.json({ success: true, message: "Webhook set successfully" });
  } catch (error) {
    console.error("Error setting webhook:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}