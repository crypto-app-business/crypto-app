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
  contract: number;
}

const tableData: TableData[] = [
  { rank: 0, contract: 1, turnover: 0, bonus: 0, percentage: [4, 3], lines: 2, },
  { rank: 1, contract: 2, turnover: 500, bonus: 25, percentage: [4, 3], lines: 2, },
  { rank: 2, contract: 3, turnover: 1100, bonus: 120, percentage: [5, 3], lines: 2, },
  { rank: 3, contract: 3, turnover: 2500, bonus: 250, percentage: [5, 3, 2], lines: 3, },
  { rank: 4, contract: 4, turnover: 5200, bonus: 400, percentage: [5, 3, 3], lines: 3, },
  { rank: 5, contract: 5, turnover: 8500, bonus: 600, percentage: [6, 3, 3], lines: 3, },
  { rank: 6, contract: 5, turnover: 12500, bonus: 800, percentage: [6, 4, 3], lines: 3, },
  { rank: 7, contract: 6, turnover: 18000, bonus: 1000, percentage: [6, 4, 4, 3], lines: 4, },
  { rank: 8, contract: 6, turnover: 27000, bonus: 1500, percentage: [6, 4, 4, 4], lines: 4, },
  { rank: 9, contract: 7, turnover: 35000, bonus: 1700, percentage: [7, 5, 4, 4, 3], lines: 5, },
  { rank: 10, contract: 7, turnover: 42000, bonus: 2000, percentage: [7, 5, 5, 5, 4], lines: 6, },
  { rank: 11, contract: 8, turnover: 55000, bonus: 2400, percentage: [7, 6, 6, 5, 4, 3], lines: 7, },
  { rank: 12, contract: 9, turnover: 100000, bonus: 5000, percentage: [8, 7, 6, 6, 4, 4, 3], lines: 8, },
  { rank: 13, contract: 10, turnover: 180000, bonus: 7500, percentage: [9, 7, 7, 7, 5, 5, 4], lines: 8, },
  { rank: 14, contract: 11, turnover: 250000, bonus: 11500, percentage: [10, 8, 8, 8, 7, 6, 5, 3], lines: 9, },
  { rank: 15, contract: 12, turnover: 400000, bonus: 20000, percentage: [10, 9, 8, 8, 7, 7, 6, 4, 3], lines: 10, },
  { rank: 16, contract: 13, turnover: 700000, bonus: 35000, percentage: [11, 10, 9, 9, 8, 8, 7, 5, 4, 4], lines: 11, },
  { rank: 17, contract: 14, turnover: 1100000, bonus: 50000, percentage: [12, 10, 10, 10, 9, 9, 8, 6, 5, 5], lines: 12, },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function calculateTurnover(user: any, maxLines: number): Promise<number> {
  let totalTurnover = 0;
  // console.log(`[user] Referrer ${user}`)
  let currentLineUsers = await User.find({ referrer: user.username }).select('_id username');
  // console.log(`[currentLineUsers] Referrer ${currentLineUsers}`)
  for (let line = 0; line < maxLines; line++) {
    if (currentLineUsers.length === 0) break;
    const minings = await MiningSession.find({ userId: { $in: currentLineUsers.map(u => u._id) } });
    // console.log(`[minings] Referrer ${minings}`)
    totalTurnover += minings.reduce((sum, m) => sum + m.amount, 0);
    // console.log(`[totalTurnover] Referrer ${totalTurnover}`)
    const nextLineUsers = await User.find({ referrer: { $in: currentLineUsers.map(u => u.username) } }).select('_id username');
    // console.log(`[nextLineUsers] Referrer ${nextLineUsers}`)
    currentLineUsers = nextLineUsers;
    // console.log(`[currentLineUsers] Referrer ${currentLineUsers}`)
  }
  return +totalTurnover;
}

export async function POST(request: Request) {
  try {
    const { userId, week, currency, amount, percentage, contractNum } = await request.json();

    if (!userId || !week || !currency || !amount || !contractNum) {
      return NextResponse.json({ error: 'Все поля обязательны.' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найдет.' }, { status: 404 });
    }

    if (!user.balance.has(currency)) {
      return NextResponse.json({ error: 'Эта криптовалюта отсуствует на балансе.' }, { status: 400 });
    }

    const currentBalance = user.balance.get(currency) || 0;
    if (currentBalance < amount) {
      return NextResponse.json({ error: 'Недостаточно средств' }, { status: 400 });
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

    // Знаходимо всі ранги, пов’язані з даним contractNum
    const possibleRanks = tableData.filter((data) => data.contract === contractNum);
    if (possibleRanks.length === 0) {
      return NextResponse.json({ error: 'Неправильный номер контракта.' }, { status: 400 });
    }

    // Отримуємо або створюємо BonusSchema для користувача
    let userBonus = await Bonus.findOne({ id: userId });
    if (!userBonus) {
      userBonus = await Bonus.create({ id: userId, rang: 0, rangWait: 0, bonus: 0, bonusRef: 0, bonusGet: [] });
    }

    // Визначаємо найвищий ранг, пов’язаний із контрактом
    const maxContractRank = Math.max(...possibleRanks.map(r => r.rank));
    let highestEligibleRank = userBonus.rang; // Початкове значення — поточний rang, а не rangWait
    let anyBonusGranted = false;

    // Перевіряємо кожен можливий ранг від найнижчого до найвищого для бонусів
    for (const rankData of possibleRanks.sort((a, b) => a.rank - b.rank)) { // Сортуємо за зростанням рангу
      const newRank = rankData.rank;

      const userTotalTurnover = await calculateTurnover(user, rankData.lines);

      // Якщо оборот достатній і ранг ще не отриманий, нараховуємо бонус
      if (userTotalTurnover >= rankData.turnover && !userBonus.bonusGet.includes(newRank)) {
        user.balance.set('USDT', (user.balance.get('USDT') || 0) + rankData.bonus);
        userBonus.bonus += rankData.bonus;
        userBonus.bonusGet.push(newRank);
        if (userBonus.rang < newRank) userBonus.rang = newRank;
        anyBonusGranted = true;

        // Додаємо запис в Operations про нарахування бонусу за ранг
        const rankBonusOperation = new Operations({
          id: userId,
          description: `Начислен бонус за ранг ${newRank}`,
          amount: rankData.bonus,
          currency: "USDT",
          type: 'bonus',
          createdAt: new Date(),
        });
        await rankBonusOperation.save();

        // Оновлюємо найвищий придатний ранг для бонусів
        if (newRank > highestEligibleRank) {
          highestEligibleRank = newRank;
        }

        await user.save();
        await userBonus.save();
      }
    }

    // Оновлюємо rangWait до найвищого рангу контракту, незалежно від обороту
    if (maxContractRank > userBonus.rangWait) {
      userBonus.rangWait = maxContractRank;
      await userBonus.save();
    }

    // Оновлюємо rang лише якщо був нарахований бонус і найвищий придатний ранг вищий за поточний
    const currentMaxRank = userBonus.rang;
    if (anyBonusGranted && highestEligibleRank > currentMaxRank) {
      userBonus.rang = highestEligibleRank;
    }

    // Забезпечуємо, що rang і rangWait завжди коректні
    userBonus.rang = currentMaxRank; // Залишаємо rang без змін, якщо бонус не нараховано
    userBonus.rangWait = Math.max(userBonus.rangWait, maxContractRank);
    await userBonus.save();

    // Перевірка рангу для всіх реферерів
    if (user.referrer) {
      let currentReferrerUsername = user.referrer;
      const referrerChain = [userId];

      while (currentReferrerUsername) {
        const referrer = await User.findOne({ username: currentReferrerUsername });
        if (!referrer) break;

        let referrerBonus = await Bonus.findOne({ id: referrer._id });
        if (!referrerBonus) {
          referrerBonus = await Bonus.create({ id: referrer._id, rang: 0, rangWait: 0, bonus: 0, bonusRef: 0, bonusGet: [] });
        }

        const referrerRankData2 = tableData.find((data) => data.rank === referrerBonus.rangWait - 1);
        if (referrerRankData2) {

          const referrerTotalTurnover = await calculateTurnover(referrer, referrerRankData2.lines);
          // console.log(`[referrerTotalTurnover] Referrer ${referrerTotalTurnover}`)
          // console.log(`[referrerRankData.turnover] Referrer ${referrerRankData2.turnover}`)
          // console.log(`[referrerBonus.rang] Referrer ${referrerBonus.rang}`)
          // console.log(`[referrerBonus.rangWait] Referrer ${referrerBonus.rangWait}`)
          // console.log(`[+] Referrer ${referrerTotalTurnover >= referrerRankData2.turnover && referrerBonus.rang < referrerBonus.rangWait}`)
          // console.log(`[+2] Referrer ${referrerBonus.rangWait === 3 || referrerBonus.rangWait === 5 || referrerBonus.rangWait === 6 || referrerBonus.rangWait === 7}`)

          if (referrerBonus.rangWait === 3 || referrerBonus.rangWait === 5 || referrerBonus.rangWait === 6 || referrerBonus.rangWait === 7)
            if (referrerTotalTurnover >= referrerRankData2.turnover && referrerBonus.rang < referrerBonus.rangWait-1) {
              referrer.balance.set('USDT', (referrer.balance.get('USDT') || 0) + referrerRankData2.bonus);
              referrerBonus.rang = referrerBonus.rangWait - 1;
              referrerBonus.bonus += referrerRankData2.bonus;
              referrerBonus.bonusGet.push(referrerBonus.rangWait - 1);
              const referrerRankBonusOperation = new Operations({
                id: referrer._id,
                description: `Начислен бонус за ранг ${referrerBonus.rangWait - 1}`,
                amount: referrerRankData2.bonus,
                currency: "USDT",
                type: 'bonus',
                createdAt: new Date(),
              });
              await referrerRankBonusOperation.save();
              await referrer.save();
              await referrerBonus.save();
            } else {
              console.log(`[DEBUG] Referrer ${currentReferrerUsername} turnover ${referrerTotalTurnover} is less than required ${referrerRankData2?.turnover} for rank ${referrerBonus.rangWait}`);
            }

        }

        const referrerRankData = tableData.find((data) => data.rank === referrerBonus.rangWait);
        if (referrerRankData) {

          const referrerTotalTurnover = await calculateTurnover(referrer, referrerRankData.lines);
          // console.log(`[referrerTotalTurnover] Referrer ${referrerTotalTurnover}`)
          // console.log(`[referrerRankData.turnover] Referrer ${referrerRankData.turnover}`)
          // console.log(`[referrerBonus.rang] Referrer ${referrerBonus.rang}`)
          // console.log(`[referrerBonus.rangWait] Referrer ${referrerBonus.rangWait}`)
          // console.log(`[+] Referrer ${referrerTotalTurnover >= referrerRankData.turnover && referrerBonus.rang < referrerBonus.rangWait}`)
          if (referrerTotalTurnover >= referrerRankData.turnover && referrerBonus.rang < referrerBonus.rangWait) {
            referrer.balance.set('USDT', (referrer.balance.get('USDT') || 0) + referrerRankData.bonus);
            referrerBonus.rang = referrerBonus.rangWait;
            referrerBonus.bonus += referrerRankData.bonus;
            referrerBonus.bonusGet.push(referrerBonus.rangWait);
            const referrerRankBonusOperation = new Operations({
              id: referrer._id,
              description: `Начислен бонус за ранг ${referrerBonus.rangWait}`,
              amount: referrerRankData.bonus,
              currency: "USDT",
              type: 'bonus',
              createdAt: new Date(),
            });
            await referrerRankBonusOperation.save();
            await referrer.save();
            await referrerBonus.save();
          } else {
            console.log(`[DEBUG] Referrer ${currentReferrerUsername} turnover ${referrerTotalTurnover} is less than required ${referrerRankData?.turnover} for rank ${referrerBonus.rangWait}`);
          }
        }

        currentReferrerUsername = referrer.referrer;
        referrerChain.push(referrer._id);
      }
    }

    // --- Друга частина логіки: реферальні відсотки ---

    if (user.referrer) {
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

      for (let line = 0; line < referrerTree.length; line++) {
        const referrerUsername = referrerTree[line];
        const referrer = await User.findOne({ username: referrerUsername });
        if (!referrer) continue;

        let referrerBonus = await Bonus.findOne({ id: referrer._id });
        if (!referrerBonus) {
          referrerBonus = new Bonus({ id: referrer._id, rang: 0, rangWait: 0, bonus: 0, bonusRef: 0, bonusGet: [] });
        }

        if (referrerBonus.rangWait > referrerBonus.rang) {
          const referrerRankData = tableData.find((data) => data.rank === referrerBonus.rangWait);
          if (referrerRankData) {
            const referrerTurnover = await calculateTurnover(referrer, referrerRankData.lines);
            if (referrerTurnover >= referrerRankData.turnover) {
              referrerBonus.rang = referrerBonus.rangWait;
              referrerBonus.bonus += referrerRankData.bonus;
              referrerBonus.bonusGet.push(referrerBonus.rangWait);
            }
          }
        }

        if (!newSession.bonusesReceivedUser.includes(referrerUsername)) {
          const referrerRankData = tableData.find((data) => data.rank === referrerBonus.rang);
          if (referrerRankData) {
            const percentageArray = referrerRankData.percentage || [];
            if (line < percentageArray.length) {
              const bonusPercentage = percentageArray[line];
              const bonusAmount = (amount * bonusPercentage) / 100;

              referrer.balance.set('USDT', (referrer.balance.get('USDT') || 0) + bonusAmount);
              referrerBonus.bonusRef += bonusAmount;
              newSession.bonusesReceivedUser.push(referrerUsername);
              const referrerRankBonusOperation = new Operations({
                id: referrer._id,
                description: `Начислен реферальный бонус`,
                amount: bonusAmount,
                currency: "USDT",
                type: 'bonus',
                createdAt: new Date(),
              });
              await referrerRankBonusOperation.save();
              await referrer.save();
              await referrerBonus.save();
            }
          }
        }
      }
    }

    await Promise.all([user.save(), newOperation.save(), newSession.save(), userBonus.save()]);

    return NextResponse.json({ success: true, data: newSession });
  } catch (error) {
    console.error(`[ERROR] Ошибка в POST: ${error}`);
    return NextResponse.json({ error: 'Ошибка сервера.' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId обязателен.' }, { status: 400 });
    }

    const userSessions = await MiningSession.find({ userId, isCompleted: false });

    const userBonus = await Bonus.findOne({ id: userId });

    return NextResponse.json({ success: true, sessions: userSessions, bonus: userBonus });
  } catch (error) {
    console.error('Ошибка получения майнинг сесии:', error);
    return NextResponse.json({ error: 'Ошибка сервера.' }, { status: 500 });
  }
}