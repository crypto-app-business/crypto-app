import { Telegraf, Markup } from "telegraf"; // Додаємо Markup для кнопок
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

// Middleware для логування chat ID (залишаємо для дебагу)
bot.use(async (ctx, next) => {
  console.log("Chat ID:", ctx.chat?.id);
  next();
});

// Головне меню з кнопками
bot.command("start", async (ctx) => {
  await ctx.reply(
    "Виберіть дію:",
    Markup.inlineKeyboard([
      [Markup.button.callback("Отримати юзерів", "getusers")],
      [Markup.button.callback("Отримати поповнення", "getdeposits")],
      [Markup.button.callback("Отримати виведення", "getwithdrawals")],
    ])
  );
});

// Обробка кнопки "Отримати юзерів"
bot.action("getusers", async (ctx) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
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
    await ctx.answerCbQuery(); // Підтверджуємо обробку натискання
  } catch (error) {
    console.error("Error getting users:", error);
    await ctx.reply("Помилка при отриманні списку користувачів.");
    await ctx.answerCbQuery();
  }
});

// Обробка кнопки "Отримати поповнення" з кнопками для підтвердження/відхилення
// Обробка кнопки "Отримати поповнення" з кнопками для підтвердження/відхилення
bot.action("getdeposits", async (ctx) => {
  try {
    const deposits = await Deposit.find({ status: "pending" });
    if (!deposits.length) {
      await ctx.reply("Депозити зі статусом 'pending' не знайдені.");
      return;
    }

    // Типізація для messages: рядок або об’єкт із текстом і кнопками
    const messages: (string | { text: string; reply_markup: ReturnType<typeof Markup.inlineKeyboard> })[] = [];
    let response: string = "Список депозитів (pending):\n\n";

    deposits.forEach((deposit, index) => {
      const depositInfo: string = `${index + 1}. ID: ${deposit.id}\n` +
        `   Валюта: ${deposit.currency}\n` +
        `   Сума: ${deposit.amount} USD\n` +
        `   Статус: ${deposit.status}\n` +
        `   Дата: ${new Date(deposit.createdAt).toLocaleString()}\n\n`;

      if (response.length + depositInfo.length > 4000) { // Залишаємо запас під кнопки
        messages.push(response);
        response = "Список депозитів (продовження):\n\n" + depositInfo;
      } else {
        response += depositInfo;
      }

      // Додаємо кнопки для кожного депозиту в кінці списку
      if ((index + 1) === deposits.length || response.length > 4000) {
        messages.push({
          text: response,
          reply_markup: Markup.inlineKeyboard(
            deposits.slice(messages.length * 10, (messages.length + 1) * 10).map(dep => [
              Markup.button.callback("Підтвердити", `confirm_${dep.id}`),
              Markup.button.callback("Відмінити", `reject_${dep.id}`),
            ])
          ),
        });
        response = "Список депозитів (продовження):\n\n";
      }
    });

    for (const msg of messages) {
      if (typeof msg === "string") {
        await ctx.reply(msg);
      } else {
        await ctx.reply(msg.text, msg.reply_markup);
      }
    }

    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Error getting deposits:", error);
    await ctx.reply("Помилка при отриманні списку депозитів.");
    await ctx.answerCbQuery();
  }
});

// Обробка кнопки "Отримати виведення"
bot.action("getwithdrawals", async (ctx) => {
  try {
    const withdrawals = await Withdrawal.find().sort({ createdAt: -1 });
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
    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Error getting withdrawals:", error);
    await ctx.reply("Помилка при отриманні списку виведень.");
    await ctx.answerCbQuery();
  }
});

// Обробка кнопок "Підтвердити" для депозитів
bot.action(/confirm_(.+)/, async (ctx) => {
  const transactionId = ctx.match[1];
  try {
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
    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Error confirming transaction:", error);
    await ctx.reply("Помилка при підтвердженні транзакції.");
    await ctx.answerCbQuery();
  }
});

// Обробка кнопок "Відмінити" для депозитів
bot.action(/reject_(.+)/, async (ctx) => {
  const transactionId = ctx.match[1];
  try {
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
    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Error rejecting transaction:", error);
    await ctx.reply("Помилка при відхиленні транзакції.");
    await ctx.answerCbQuery();
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
    const webhookUrl = `${process.env.VERCEL_URL}/api/telegram/webhook`;

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