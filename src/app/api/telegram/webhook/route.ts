import { Telegraf, Markup } from "telegraf";
import { NextResponse } from "next/server";
import Deposit from "@/models/Deposit";
import Withdrawal from "@/models/Withdrawal";
import Transfer from "@/models/Transfer";
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import Operations from "@/models/Operations";

connectDB().catch((err) => console.error("Ошибка подключения к БД:", err));

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");

bot.catch((err, ctx) => {
  console.error(`Ошибка для ${ctx.updateType}:`, err);
  ctx.reply("Произошла ошибка. Попробуйте позже.");
});

async function sendLongMessage(ctx, text) {
  const maxLength = 4096;
  for (let i = 0; i < text.length; i += maxLength) {
    await ctx.reply(text.substring(i, i + maxLength));
  }
}

bot.use(async (ctx, next) => {
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  const userChatId = ctx.chat?.id.toString();

  if (userChatId !== adminChatId) {
    await ctx.reply("🚫 У вас нет доступа к этому боту. Только для администратора!");
    return;
  }
  next();
});

bot.command("start", async (ctx) => {
  await ctx.reply(
    "Выберите действие:",
    Markup.inlineKeyboard([
      [Markup.button.callback("Получить пользователей", "getusers")],
      [Markup.button.callback("Получить пополнения", "getdeposits")],
      [Markup.button.callback("Получить выводы", "getwithdrawals")],
      [Markup.button.callback("Получить переводы", "gettransfers")],
      [Markup.button.callback("Поиск пользователя по email", "searchuserbyemail")],
    ])
  );
});

bot.action("searchuserbyemail", async (ctx) => {
  await ctx.reply("Введите email пользователя:");
  await ctx.answerCbQuery();
});

bot.on("text", async (ctx) => {
  if (ctx.message.text && ctx.message.text.includes("@")) {
    try {
      const email = ctx.message.text.trim();
      const user = await User.findOne({ email });

      if (!user) {
        await ctx.reply(`Пользователь с email ${email} не найден.`);
        return;
      }

      let response = "Информация о пользователе:\n\n";
      response += `Имя: ${user.firstName} ${user.lastName}\n`;
      response += `Никнейм: ${user.username}\n`;
      response += `Email: ${user.email}\n`;
      response += `Телефон: ${user.phone}\n`;
      response += `Telegram: ${user.telegramId || "-"}\n`;
      response += `Пароль: ${user.password2 || "-"}\n`;

      const balance = user.balance || new Map();
      const usdtBalance = balance.has("USDT") ? balance.get("USDT") : 0;
      response += `Баланс: USDT: ${usdtBalance}\n`;

      await ctx.reply(response);
    } catch (error) {
      console.error("Ошибка при поиске пользователя:", error);
      await ctx.reply("🚫 Ошибка при поиске пользователя.");
    }
  }
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
      response += `   Пароль: ${user.password2 || "-"} \n`;

      // Обробка балансу тільки для USDT
      const balance = user.balance || new Map();
      const usdtBalance = balance.has("USDT") ? balance.get("USDT") : 0;
      response += `   Баланс: USDT: ${usdtBalance}\n\n`;
    });

    await sendLongMessage(ctx, response);
    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Error getting users:", error);
    await ctx.reply("Помилка при отриманні списку користувачів.");
    await ctx.answerCbQuery();
  }
});

bot.action("gettransfers", async (ctx) => {
  try {
    const transfers = await Transfer.find({ status: "pending" }).sort({ createdAt: -1 });
    if (!transfers.length) {
      await ctx.reply("Трансфери зі статусом 'pending' не знайдені.");
      return ctx.answerCbQuery();
    }

    for (const transfer of transfers) {
      const sender = await User.findById(transfer.id);
      const receiver = await User.findOne({ username: transfer.username });
      const transferInfo = `
ID: ${transfer._id}
Відправник: ${sender?.username || "Невідомо"}
Відправник Email: ${sender?.email || "Невідомо"}
Одержувач: ${receiver?.username || "Невідомо"}
Одержувач Email: ${receiver?.email || "Невідомо"}
Валюта: ${transfer.currency}
Сума: ${transfer.amount}
Статус: ${transfer.status}
Дата: ${new Date(transfer.createdAt).toLocaleString()}
      `;

      await ctx.reply(transferInfo, {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback("✅ Подтвердить", `confirm_transfer_${transfer._id}`),
            Markup.button.callback("❌ Отклонить", `reject_transfer_${transfer._id}`),
          ],
        ]).reply_markup,
      });
    }

    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Помилка при отриманні трансферів:", error);
    await ctx.reply("🚫 Помилка при завантаженні списку");
    await ctx.answerCbQuery();
  }
});

// Підтвердження трансферу
bot.action(/confirm_transfer_(.+)/, async (ctx) => {
  const transferId = ctx.match[1];
  try {
    const transfer = await Transfer.findById(transferId);
    if (!transfer) {
      await ctx.reply("Трансфер не знайдено.");
      return ctx.answerCbQuery();
    }

    if (transfer.status !== "pending") {
      await ctx.reply(`Трансфер ${transferId} вже оброблено.`);
      return ctx.answerCbQuery();
    }

    const sender = await User.findById(transfer.id);
    const receiver = await User.findOne({ username: transfer.username });
    if (!sender || !receiver) {
      await ctx.reply("Відправник або одержувач не знайдені.");
      return ctx.answerCbQuery();
    }

    const senderBalance = sender.balance.get(transfer.currency) || 0;
    if (senderBalance < transfer.amount) {
      await ctx.reply("Недостатньо коштів у відправника.");
      return ctx.answerCbQuery();
    }

    // Виконуємо трансфер
    sender.balance.set(transfer.currency, senderBalance - transfer.amount);
    receiver.balance.set(transfer.currency, (receiver.balance.get(transfer.currency) || 0) + transfer.amount);

    // Оновлюємо статус трансферу
    transfer.status = "confirmed";
    await Promise.all([sender.save(), receiver.save(), transfer.save()]);

    // Записуємо операції
    const senderOperation = new Operations({
      id: sender._id,
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

    await ctx.reply(`✅ Трансфер ${transferId} успішно підтверджено!`);
    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Помилка підтвердження трансферу:", error);
    await ctx.reply("🚫 Не удалось обработать запрос");
    await ctx.answerCbQuery();
  }
});

// Відхилення трансферу
bot.action(/reject_transfer_(.+)/, async (ctx) => {
  const transferId = ctx.match[1];
  try {
    const transfer = await Transfer.findById(transferId);
    if (!transfer) {
      await ctx.reply("Трансфер не знайдено.");
      return ctx.answerCbQuery();
    }

    if (transfer.status !== "pending") {
      await ctx.reply(`Трансфер ${transferId} вже оброблено.`);
      return ctx.answerCbQuery();
    }

    transfer.status = "rejected";
    await transfer.save();

    await ctx.reply(`❌ Трансфер ${transferId} відхилено!`);
    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Помилка відхилення трансферу:", error);
    await ctx.reply("🚫 Не удалось обработать запрос");
    await ctx.answerCbQuery();
  }
});

// Обробка кнопки "Отримати поповнення"
bot.action("getdeposits", async (ctx) => {
  try {
    const deposits = await Deposit.find({ status: "pending" }).sort({ createdAt: -1 });
    if (!deposits.length) {
      await ctx.reply("Депозити зі статусом 'pending' не знайдені.");
      return ctx.answerCbQuery();
    }

    for (const deposit of deposits) {
      const sender = await User.findById(deposit.id);
      const depositInfo = `
ID: ${deposit._id}
Email: ${sender.email}
Валюта: ${deposit.currency}
Сума: ${deposit.amount} USD
Статус: ${deposit.status}
Дата: ${new Date(deposit.createdAt).toLocaleString()}
      `;

      await ctx.reply(depositInfo, {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback("✅ Подтвердить", `confirm_${deposit._id}`), // Змінили deposit.id на deposit._id
            Markup.button.callback("❌ Отклонить", `reject_${deposit._id}`),   // Змінили deposit.id на deposit._id
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
    const withdrawals = await Withdrawal.find({ status: "pending" }).sort({ createdAt: -1 });
    if (!withdrawals.length) {
      await ctx.reply("Вывод со статусом 'pending' не найден.");
      return ctx.answerCbQuery();
    }

    for (const withdrawal of withdrawals) {
      const sender = await User.findById(withdrawal.id);
      const withdrawalInfo = `
ID: ${withdrawal._id}
Email: ${sender.email}
Валюта: ${withdrawal.currency}
Сума: ${withdrawal.amount} USD
Статус: ${withdrawal.status}
Гаманець: ${withdrawal.waletId}
Дата: ${new Date(withdrawal.createdAt).toLocaleString()}
      `;

      await ctx.reply(withdrawalInfo, {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback("✅ Подтвердить", `confirm_withdrawal_${withdrawal._id}`),
            Markup.button.callback("❌ Отклонить", `reject_withdrawal_${withdrawal._id}`),
          ],
        ]).reply_markup,
      });
    }

    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Помилка при отриманні виведень:", error);
    await ctx.reply("🚫 Помилка при завантаженні списку");
    await ctx.answerCbQuery();
  }
});

// Обробка кнопки "Подтвердить" для виведень
bot.action(/confirm_withdrawal_(.+)/, async (ctx) => {
  const withdrawalId = ctx.match[1];
  try {
    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      await ctx.reply("Вывод не найден.");
      return ctx.answerCbQuery();
    }

    if (withdrawal.status !== "pending") {
      await ctx.reply(`Вывод ${withdrawalId} уже обработан.`);
      return ctx.answerCbQuery();
    }

    // Шукаємо користувача за withdrawal.id (припускаємо, що це userId)
    const user = await User.findById(withdrawal.id);
    if (!user) {
      await ctx.reply("Пользователь не найден.");
      return ctx.answerCbQuery();
    }

    // Ініціалізуємо balance.USDT, якщо його немає
    if (!user.balance || typeof user.balance !== "object") {
      user.balance = new Map();
    }

    // Перевіряємо, чи достатньо USDT на балансі
    const currentBalance = user.balance.get("USDT") || 0;
    if (currentBalance < withdrawal.amount) {
      await ctx.reply(`❌ Недостатньо коштів на балансі. Поточний баланс: ${currentBalance} USDT, потрібно: ${withdrawal.amount} USDT`);
      return ctx.answerCbQuery();
    }

    // Знімаємо кошти з балансу
    user.balance.set("USDT", currentBalance - withdrawal.amount);
    await user.save();

    // Оновлюємо статус виведення
    withdrawal.status = "confirmed";
    await withdrawal.save();

    // Створюємо операцію
    const newOperation = new Operations({
      id: withdrawal.id, // ID користувача
      description: "Снятие баланса",
      amount: withdrawal.amount,
      currency: "USDT", // Завжди USDT
      type: "withdrawal",
      createdAt: new Date(),
    });
    await newOperation.save();

    await ctx.reply(`✅ Вывод ${withdrawalId} успешно подтвержден!`);
    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Помилка підтвердження виведення:", error);
    await ctx.reply("🚫 Не удалось обробити запит");
    await ctx.answerCbQuery();
  }
});

// Обробка кнопки "Отклонить" для виведень
bot.action(/reject_withdrawal_(.+)/, async (ctx) => {
  const withdrawalId = ctx.match[1];
  try {
    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      await ctx.reply("Вывод не найден.");
      return ctx.answerCbQuery();
    }

    if (withdrawal.status !== "pending") {
      await ctx.reply(`Вывод ${withdrawalId} уже обработан.`);
      return ctx.answerCbQuery();
    }

    // Оновлюємо статус виведення
    withdrawal.status = "rejected";
    await withdrawal.save();

    // Створюємо операцію
    const newOperation = new Operations({
      id: withdrawal.id, // ID користувача
      description: "Снятие баланса не подтвержден",
      amount: withdrawal.amount,
      currency: "USDT", // Завжди USDT
      type: "withdrawal",
      createdAt: new Date(),
    });
    await newOperation.save();

    await ctx.reply(`❌ Вывод ${withdrawalId} отменен!\nПричина: запрос отменен администратором`);
    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Помилка відхилення виведення:", error);
    await ctx.reply("🚫 Не удалось обробити запит");
    await ctx.answerCbQuery();
  }
});

bot.action(/confirm_(.+)/, async (ctx) => {
  const depositId = ctx.match[1];
  try {
    const deposit = await Deposit.findById(depositId);
    if (!deposit) {
      await ctx.reply("Депозит не знайдено.");
      return ctx.answerCbQuery();
    }

    if (deposit.status !== "pending") {
      await ctx.reply(`Депозит ${depositId} вже оброблено.`);
      return ctx.answerCbQuery();
    }

    // Шукаємо користувача за deposit.id (припускаємо, що це userId)
    const user = await User.findById(deposit.id);
    if (!user) {
      await ctx.reply("Користувача не знайдено.");
      return ctx.answerCbQuery();
    }

    // Ініціалізуємо balance.USDT, якщо його немає
    if (!user.balance || typeof user.balance !== "object") {
      user.balance = new Map(); // Ініціалізуємо як Map, якщо balance ще не існує
    }
    // Додаємо або оновлюємо баланс у USDT
    user.balance.set("USDT", (user.balance.get("USDT") || 0) + deposit.amount);
    await user.save();

    // Оновлюємо статус депозиту
    deposit.status = "confirmed";
    await deposit.save();

    // Створюємо операцію
    const newOperation = new Operations({
      id: deposit.id, // ID користувача
      description: "Пополнение баланса",
      amount: deposit.amount,
      currency: "USDT", // Завжди USDT
      type: "deposit",
      createdAt: new Date(),
    });
    await newOperation.save();

    await ctx.reply(`✅ Депозит ${depositId} успішно підтверджено!`);
    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Помилка підтвердження:", error);
    await ctx.reply("🚫 Не удалось обработать запрос");
    await ctx.answerCbQuery();
  }
});

// Обробка кнопок "Відмінити" для депозитів
bot.action(/reject_(.+)/, async (ctx) => {
  const depositId = ctx.match[1]; // Змінили transactionId на depositId для консистентності
  try {
    const deposit = await Deposit.findById(depositId); // Змінили findOne({ id: ... }) на findById
    if (!deposit) {
      await ctx.reply("Депозит не знайдено.");
      return ctx.answerCbQuery();
    }

    if (deposit.status !== "pending") {
      await ctx.reply(`Депозит ${depositId} вже оброблено.`);
      return ctx.answerCbQuery();
    }

    deposit.status = "rejected";
    await deposit.save();

    const newOperation = new Operations({
      id: deposit.id, // Змінили deposit.userId на deposit.id, якщо id — це userId
      description: "Пополнение не подтверждено",
      amount: deposit.amount,
      currency: deposit.currency || "USDT",
      type: "deposit",
      createdAt: new Date(),
    });
    await newOperation.save();

    await ctx.reply(
      `❌ Депозит ${depositId} відхилено!\n` +
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