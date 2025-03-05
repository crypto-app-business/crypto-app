import { Telegraf, Markup } from "telegraf"; // Додаємо Markup для кнопок
import { NextResponse } from "next/server";
import Deposit from "@/models/Deposit";
import Withdrawal from "@/models/Withdrawal";
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import Operations from "@/models/Operations";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");

// З’єднуємося з базою даних при ініціалізації бота
bot.use(async (ctx, next) => {
  await connectDB();
  next();
});

// Middleware для логування chat ID (залишаємо для дебагу)
bot.use(async (ctx, next) => {
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  console.log("Chat ID:", ctx.chat?.id);
  console.log("Chat ID admin:", adminChatId);
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
// Обробник кнопки "Отримати поповнення"
bot.action("getdeposits", async (ctx) => {
  try {
    const deposits = await Deposit.find({ status: "pending" }).sort({ createdAt: -1 });
    if (!deposits.length) {
      await ctx.reply("Депозити зі статусом 'pending' не знайдені.");
      return ctx.answerCbQuery();
    }

    // Відправляємо кожен депозит окремим повідомленням з кнопками
    for (const deposit of deposits) {
      const depositInfo = `
ID: ${deposit.id}
Валюта: ${deposit.currency}
Сума: ${deposit.amount} USD
Статус: ${deposit.status}
Дата: ${new Date(deposit.createdAt).toLocaleString()}
      `;

      await ctx.reply(depositInfo, {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback("✅ Підтвердити", `confirm_${deposit.id}`),
            Markup.button.callback("❌ Відхилити", `reject_${deposit.id}`),
          ],
        ]).reply_markup,
      });
    }

    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Помилка при отриманні депозитів:", error);
    await ctx.reply("🚫 Помилка при завантаженні списку");
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
  const depositId = ctx.match[1];
  try {
    const deposit = await Deposit.findById(depositId);
    if (!deposit) {
      await ctx.reply("Депозит не знайдено.");
      return ctx.answerCbQuery();
    }

    // Перевірка статусу
    if (deposit.status !== "pending") {
      await ctx.reply(`Депозит ${depositId} вже оброблено.`);
      return ctx.answerCbQuery();
    }

    // Оновлення балансу користувача
    const user = await User.findById(deposit.userId);
    if (user) {
      user.balance.set(deposit.USDT, (user.balance.get(deposit.USDT) || 0 + deposit.amount));
      await user.save();
    }

    // Зміна статусу депозиту
    deposit.status = "confirmed";
    await deposit.save();

    await ctx.reply(`✅ Депозит ${depositId} успішно підтверджено!`);
    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Помилка підтвердження:", error);
    await ctx.reply("🚫 Не вдалося обробити запит");
    await ctx.answerCbQuery();
  }
});

// Обробка кнопок "Відмінити" для депозитів
bot.action(/reject_(.+)/, async (ctx) => {
  const transactionId = ctx.match[1];
  try {
    // Знаходимо депозит
    const deposit = await Deposit.findOne({ id: transactionId });
    if (!deposit) {
      await ctx.reply("Депозит не знайдено.");
      return ctx.answerCbQuery();
    }

    // Перевірка статусу
    if (deposit.status !== "pending") {
      await ctx.reply(`Депозит ${transactionId} вже оброблено.`);
      return ctx.answerCbQuery();
    }

    // Оновлюємо статус
    deposit.status = "rejected";
    await deposit.save();

    // Створюємо операцію
    const newOperation = new Operations({
      id: deposit.userId,
      description: "Поповнення відхилено",
      amount: deposit.amount,
      currency: deposit.currency || "USDT",
      type: "deposit",
      createdAt: new Date(),
    });
    await newOperation.save();

    await ctx.reply(
      `❌ Депозит ${transactionId} відхилено!\n` +
      `Причина: запит скасовано адміністратором`
    );

    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Помилка відхилення:", error);
    await ctx.reply("🚫 Помилка при обробці запиту");
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