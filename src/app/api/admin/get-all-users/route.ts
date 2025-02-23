import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';


export async function GET(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Неавторизований' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    console.log(token)

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: 'Недійсний токен' }, { status: 401 });
    }


    const adminUser = await User.findById(decoded.id);
    console.log(decoded.id)

    console.log(adminUser)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Недостатньо прав' }, { status: 403 });
    }

    const users = await User.find({}, '-password'); // Відправляємо користувачів без паролів

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Помилка отримання користувачів:', error);
    return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
  }
}
