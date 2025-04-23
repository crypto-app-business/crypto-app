import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { GridFSBucket, Db } from 'mongodb';
import { Readable } from 'stream';
import jwt from 'jsonwebtoken';
import Avatar from '@/models/Avatar';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';

// Інтерфейс для токена
interface JwtPayload {
  id: string;
  email: string;
}

// Функція для підключення до MongoDB
async function connectToDatabase(): Promise<Db> {
  await connectDB();
  if (!mongoose.connection.db) {
    throw new Error('Database connection not established');
  }
  return mongoose.connection.db;
}

// Ініціалізація GridFS
async function getGridFSBucket(): Promise<GridFSBucket> {
  const db = await connectToDatabase();
  return new GridFSBucket(db, {
    bucketName: 'avatars',
  });
}

// Функція для перевірки токена
function verifyToken(req: NextRequest): JwtPayload {
  const authHeader = req.headers.get('Authorization');
  console.log('Authorization header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Токен відсутній або невалідний');
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as JwtPayload;
    console.log('Decoded token:', decoded);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Невалідний токен');
  }
}

// Обробник POST-запиту
export async function POST(req: NextRequest) {
  try {
    // Перевірка токена
    const decoded = verifyToken(req);
    const userId = decoded.id;

    // Перевірка, чи userId є валідним ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid ObjectId:', userId);
      return NextResponse.json({ success: false, message: 'Invalid user ID format' }, { status: 400 });
    }

    // Перевірка існування користувача
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found for _id:', userId);
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Обробка FormData
    const formData = await req.formData();
    const file = formData.get('avatar') as File;
    const userIdFromForm = formData.get('userId') as string;

    console.log('userId from token:', userId, 'userId from form:', userIdFromForm);

    if (!file || !userIdFromForm) {
      return NextResponse.json({ success: false, message: 'File and userId are required' }, { status: 400 });
    }

    if (userId !== userIdFromForm) {
      return NextResponse.json({ success: false, message: 'Unauthorized: userId mismatch' }, { status: 403 });
    }

    // Перевірка розміру файлу (20 МБ)
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'File too large (max 20 MB)' }, { status: 400 });
    }

    // Перевірка типу файлу (виключити SVG)
    if (file.type === 'image/svg+xml') {
      return NextResponse.json({ success: false, message: 'SVG files are not allowed' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, message: 'Only images are allowed' }, { status: 400 });
    }

    // Ініціалізація GridFS
    const gfs = await getGridFSBucket();

    // Конвертація File у Readable Stream
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);

    // Завантаження файлу в GridFS
    const uploadStream = gfs.openUploadStream(`${userId}_${file.name}`, {
      contentType: file.type,
      metadata: { userId },
    });

    await new Promise((resolve, reject) => {
      stream.pipe(uploadStream)
        .on('error', reject)
        .on('finish', resolve);
    });

    // Створення або оновлення аватара
    console.log('Saving avatar for userId:', userId);
    const avatar = await Avatar.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $set: { avatarUrl: `/api/avatar/${uploadStream.id}` } },
      { upsert: true, new: true, runValidators: true }
    );

    console.log('Saved avatar:', avatar);

    return NextResponse.json({
      success: true,
      avatarUrl: `/api/avatar/${uploadStream.id}`,
    });
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}

// Обробник для отримання аватарки
export async function GET(req: NextRequest) {
  try {
    const gfs = await getGridFSBucket();

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('id');

    if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
      return NextResponse.json({ success: false, message: 'Invalid file ID' }, { status: 400 });
    }

    const downloadStream = gfs.openDownloadStream(new mongoose.Types.ObjectId(fileId));

    return new NextResponse(downloadStream as any, {
      headers: {
        'Content-Type': 'image/*',
      },
    });
  } catch (error: any) {
    console.error('Error retrieving avatar:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
