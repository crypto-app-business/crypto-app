import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import User from '@/models/User';
import MiningSession from '@/models/MiningSession';

export async function GET(req: Request) {
  try {
    await connectDB(); // Підключення до бази даних

    // Отримуємо параметри з URL
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Знаходимо користувача
    const rootUser = await User.findById(userId);
    if (!rootUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Побудова дерева реферерів
    const buildReferralTree = async (username: string, depth = 1, maxDepth = 10, visited = new Set()) => {
      if (depth > maxDepth || visited.has(username)) return [];
      visited.add(username);

      const users = await User.find({ referrerUsername: username });
      const tree = await Promise.all(
        users.map(async (user) => {
          const deposits = await MiningSession.find({ userId: user._id });
          return {
            email: user.email,
            referrer: user.referrerUsername !== 'none' ? user.referrerUsername : 'None',
            registrationDate: user.createdAt,
            deposits: deposits.map(({ currency, amount }) => ({ currency, amount })),
            line: depth,
            subTree: await buildReferralTree(user.username, depth + 1, maxDepth, visited),
          };
        })
      );
      return tree;
    };

    const teamTree = await buildReferralTree(rootUser.username);
    return NextResponse.json(teamTree, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/getTeam:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
