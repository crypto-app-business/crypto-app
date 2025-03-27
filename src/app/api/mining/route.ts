import { NextResponse } from 'next/server';
import MiningSession from '@/models/MiningSession';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import Operations from '@/models/Operations';
import Bonus from '@/models/Bonus';

// Типізація для tableData
interface TableData {
  rank: number;
  turnover: number;
  bonus: number;
  percentage: number[];
  lines: number;
  contractMin: number;
  contractMax: number;
}

const tableData: TableData[] = [
  { rank: 1, turnover: 0, bonus: 0, percentage: [4, 3], lines: 2, contractMin: 0, contractMax: 100 },
  { rank: 2, turnover: 500, bonus: 25, percentage: [4, 3], lines: 2, contractMin: 100, contractMax: 250 },
  { rank: 3, turnover: 1100, bonus: 120, percentage: [5, 3], lines: 3, contractMin: 250, contractMax: 500 },
  { rank: 4, turnover: 2500, bonus: 250, percentage: [5, 3, 2], lines: 3, contractMin: 250, contractMax: 500 },
  { rank: 5, turnover: 5200, bonus: 400, percentage: [5, 3, 3], lines: 3, contractMin: 500, contractMax: 1000 },
  { rank: 6, turnover: 8500, bonus: 600, percentage: [6, 3, 3], lines: 3, contractMin: 1000, contractMax: 2000 },
  { rank: 7, turnover: 12500, bonus: 800, percentage: [6, 4, 3], lines: 4, contractMin: 2000, contractMax: 3000 },
  { rank: 8, turnover: 18000, bonus: 1000, percentage: [6, 4, 4, 3], lines: 4, contractMin: 3000, contractMax: 4000 },
  { rank: 9, turnover: 27000, bonus: 1500, percentage: [6, 4, 4, 4], lines: 5, contractMin: 4000, contractMax: 5000 },
  { rank: 10, turnover: 35000, bonus: 1700, percentage: [7, 5, 4, 4, 3], lines: 6, contractMin: 5000, contractMax: 7500 },
  { rank: 11, turnover: 42000, bonus: 2000, percentage: [7, 5, 5, 5, 4], lines: 7, contractMin: 7500, contractMax: 10000 },
  { rank: 12, turnover: 55000, bonus: 2400, percentage: [7, 6, 6, 5, 4, 3], lines: 8, contractMin: 10000, contractMax: 12500 },
  { rank: 13, turnover: 100000, bonus: 5000, percentage: [8, 7, 6, 6, 4, 4, 3], lines: 8, contractMin: 12500, contractMax: 17500 },
  { rank: 14, turnover: 180000, bonus: 7500, percentage: [9, 7, 7, 7, 5, 5, 4], lines: 9, contractMin: 17500, contractMax: 25000 },
  { rank: 15, turnover: 250000, bonus: 11500, percentage: [10, 8, 8, 8, 7, 6, 5, 3], lines: 9, contractMin: 25000, contractMax: 37500 },
  { rank: 16, turnover: 400000, bonus: 20000, percentage: [10, 9, 8, 8, 7, 7, 6, 4, 3], lines: 10, contractMin: 37500, contractMax: 50000 },
  { rank: 17, turnover: 700000, bonus: 35000, percentage: [11, 10, 9, 9, 8, 8, 7, 5, 4, 4], lines: 11, contractMin: 50000, contractMax: 75000 },
  { rank: 18, turnover: 1100000, bonus: 50000, percentage: [12, 10, 10, 10, 9, 9, 8, 6, 5, 5], lines: 11, contractMin: 75000, contractMax: 100000000 },
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function calculateTurnover(user: any, maxLines: number): Promise<number> {

  let totalTurnover = 0;
  let currentLineUsers = await User.find({ referrer: user.username }).select('_id username');
  for (let line = 0; line < maxLines; line++) {
    if (currentLineUsers.length === 0) break;
    const minings = await MiningSession.find({ userId: { $in: currentLineUsers.map(u => u._id) } });
    totalTurnover += minings.reduce((sum, m) => sum + m.amount, 0);
    const nextLineUsers = await User.find({ referrer: { $in: currentLineUsers.map(u => u.username) } }).select('_id username');
    currentLineUsers = nextLineUsers;
  }
  return totalTurnover;
}

export async function POST(request: Request) {
  try {
    const { userId, week, currency, amount, percentage } = await request.json();

    if (!userId || !week || !currency || !amount) {
      return NextResponse.json({ error: 'Усі поля обов’язкові.' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Користувач не знайдений.' }, { status: 404 });
    }

    if (!user.balance.has(currency)) {
      return NextResponse.json({ error: 'Ця криптовалюта відсутня на балансі.' }, { status: 400 });
    }

    const currentBalance = user.balance.get(currency) || 0;
    if (currentBalance < amount) {
      return NextResponse.json({ error: 'Недостатньо коштів' }, { status: 400 });
    }

    // Оновлюємо баланс користувача
    user.balance.set(currency, currentBalance - amount);
    await user.save();

    // Створюємо операцію
    const newOperation = new Operations({
      id: userId,
      description: `Вложено в майнинг`,
      amount,
      currency: "USDT",
      type: 'mining',
      createdAt: new Date(),
    });
    await newOperation.save();

    // Створюємо нову сесію майнінгу
    const newSession = await MiningSession.create({
      userId,
      week,
      currency,
      amount,
      percentage,
      startDate: new Date(),
      endDate: new Date(Date.now() + week * 7 * 24 * 60 * 60 * 1000),
      paidDays: 0,
    });

    // --- Перша частина логіки: перевірка рангу та бонусів ---

    // Знаходимо ранг на основі amount
    const rankData = tableData.find(
      (data) => amount >= data.contractMin && amount <= data.contractMax
    );
    const newRank = rankData ? rankData.rank : 1;

    // Отримуємо або створюємо BonusSchema для користувача
    let userBonus = await Bonus.findOne({ id: userId });
    if (!userBonus) {
      userBonus = await Bonus.create({ id: userId, rang: 1, rangWait: 1, bonus: 0, bonusRef: 0, bonusGet: [] });
    }

    // Якщо новий ранг більший за поточний rangWait і його немає в bonusGet
    if (newRank > userBonus.rangWait && !userBonus.bonusGet.includes(newRank)) {
      userBonus.rangWait = newRank;
      await userBonus.save();
    }

    // Якщо rang === rangWait, нічого не робимо
    if (userBonus.rang === userBonus.rangWait) {
      // Пропускаємо
    } else {
      // Перевіряємо turnover по реферальним лініям
      let totalTurnover = 0;
      const referralLines: string[][] = [[]]; // Масив для зберігання ліній

      // Знаходимо всіх користувачів, де я є реферером (1 лінія)
      const firstLineUsers = await User.find({ referrer: user.username });
      referralLines[0] = firstLineUsers.map(u => u.username);

      // Отримуємо суму майнінгів 1 лінії
      const firstLineMinings = await MiningSession.find({ userId: { $in: firstLineUsers.map(u => u._id) } });
      totalTurnover += firstLineMinings.reduce((sum, m) => sum + m.amount, 0);

      // Перевіряємо наступні лінії
      let currentLineUsers = firstLineUsers;
      for (let line = 1; line < userBonus.rangWait; line++) {
        const nextLineUsers = await User.find({ referrer: { $in: currentLineUsers.map(u => u.username) } });
        referralLines[line] = nextLineUsers.map(u => u.username);
        const nextLineMinings = await MiningSession.find({ userId: { $in: nextLineUsers.map(u => u._id) } });
        totalTurnover += nextLineMinings.reduce((sum, m) => sum + m.amount, 0);
        currentLineUsers = nextLineUsers;
      }

      // Знаходимо об'єкт у tableData для rangWait
      const rankWaitData = tableData.find((data) => data.rank === userBonus.rangWait);
      if (rankWaitData && totalTurnover >= rankWaitData.turnover) {
        // Нараховуємо бонус
        user.balance.set('USDT', (user.balance.get('USDT') || 0) + rankWaitData.bonus);
        userBonus.rang = userBonus.rangWait;
        userBonus.bonus += rankWaitData.bonus;
        userBonus.bonusGet.push(userBonus.rangWait);
        await user.save();
        await userBonus.save();
      }
    }

    // --- Друга частина логіки: реферальні відсотки ---

    if (user.referrer) {
      // Будуємо дерево реферерів до 11 ліній
      const referrerTree: string[] = [user.referrer];
      let currentReferrer = user.referrer;
      for (let i = 1; i < 11; i++) {
        const referrerUser = await User.findOne({ username: currentReferrer });
        if (referrerUser && referrerUser.referrer) {
          referrerTree.push(referrerUser.referrer);
          currentReferrer = referrerUser.referrer;
        } else {
          break;
        }
      }

      // Перевіряємо кожного реферера
      for (let line = 0; line < referrerTree.length; line++) {
        const referrerUsername = referrerTree[line];
        const referrer = await User.findOne({ username: referrerUsername });
        if (!referrer) continue;

        let referrerBonus = await Bonus.findOne({ id: referrer._id });
        if (!referrerBonus) {
          referrerBonus = new Bonus({ id: referrer._id, rang: 1, rangWait: 1, bonus: 0, bonusRef: 0, bonusGet: [] });
        }

        // Перевіряємо оновлення рангу реферера
        if (referrerBonus.rangWait > referrerBonus.rang) {
          const referrerTurnover = await calculateTurnover(referrer, referrerBonus.rangWait);
          const referrerRankData = tableData.find((data) => data.rank === referrerBonus.rangWait);
          if (referrerRankData && referrerTurnover >= referrerRankData.turnover) {
            console.log(`[DEBUG] Реферер ${referrerUsername} підвищив ранг до ${referrerBonus.rangWait}`);
            referrerBonus.rang = referrerBonus.rangWait;
            referrerBonus.bonus += referrerRankData.bonus;
            referrerBonus.bonusGet.push(referrerBonus.rangWait);
          }
        }

        // Нараховуємо реферальний бонус
        if (!newSession.bonusesReceivedUser.includes(referrerUsername)) {
          const percentageArray = tableData.find((data) => data.rank === referrerBonus.rang)?.percentage || [];
          if (line < percentageArray.length) {
            const bonusPercentage = percentageArray[line];
            const bonusAmount = (amount * bonusPercentage) / 100;
            console.log(`[DEBUG] Нараховуємо рефереру ${referrerUsername} бонус ${bonusAmount} USDT (лінія ${line + 1})`);

            referrer.balance.set('USDT', (referrer.balance.get('USDT') || 0) + bonusAmount);
            referrerBonus.bonusRef += bonusAmount;
            newSession.bonusesReceivedUser.push(referrerUsername);

            await referrer.save();
            await referrerBonus.save();
          }
        }
      }
    }

    // Зберігаємо всі зміни в одній транзакції
    await Promise.all([user.save(), newOperation.save(), newSession.save(), userBonus.save()]);
    console.log(`[DEBUG] Успішно збережено всі зміни для користувача ${userId}`);

    return NextResponse.json({ success: true, data: newSession });
  } catch (error) {
    console.error(`[ERROR] Помилка в POST: ${error}`);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId є обов’язковим.' }, { status: 400 });
    }

    const userSessions = await MiningSession.find({ userId, isCompleted: false });

    const userBonus = await Bonus.findOne({ id: userId });

    return NextResponse.json({ success: true, sessions: userSessions, bonus: userBonus });
  } catch (error) {
    console.error('Помилка отримання майнінг-сесій:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}