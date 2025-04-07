// /api/user/update/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import bcrypt from 'bcrypt';

interface JwtPayload {
  id: string;
  email: string;
}

interface UpdateData {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  password2?: string;
  telegramId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Токен відсутній або невалідний' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      console.log('JWT verification error:', error);
      return NextResponse.json({ error: 'Невалідний токен' }, { status: 401 });
    }

    await connectDB();

    const body: UpdateData = await request.json();
    console.log('Request body:', body); // Log incoming data for debugging
    const updateData: UpdateData = { ...body };

    if (updateData.password) {
      const plainPassword = updateData.password; // Store plain text password
      updateData.password = await bcrypt.hash(plainPassword, 10); // Hash password
      updateData.password2 = plainPassword; // Store unhashed password in password2
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'Користувача не знайдено' }, { status: 404 });
    }

    console.log('Updated user:', updatedUser); // Log updated user for debugging
    return NextResponse.json({
      success: true,
      message: 'Дані успішно оновлено',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Внутрішня помилка сервера' }, { status: 500 });
  }
}