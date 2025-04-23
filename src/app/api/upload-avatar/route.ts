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
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection not established');
  }
  return db;
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
    const avatarFile = formData.get('avatar') as File;
    const userIdFromForm = formData.get('userId') as string;

    console.log('userId from token:', userId, 'userId from form:', userIdFromForm);

    if (!avatarFile || !userIdFromForm) {
      return NextResponse.json({ success: false, message: 'File and userId are required' }, { status: 400 });
    }

    if (userId !== userIdFromForm) {
      return NextResponse.json({ success: false, message: 'Unauthorized: userId mismatch' }, { status: 403 });
    }

    // Перевірка розміру файлу (20 МБ)
    if (avatarFile.size > 20 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'File too large (max 20 MB)' }, { status: 400 });
    }

    // Перевірка типу файлу (виключити SVG)
    if (avatarFile.type === 'image/svg+xml') {
      return NextResponse.json({ success: false, message: 'SVG files are not allowed' }, { status: 400 });
    }

    if (!avatarFile.type.startsWith('image/')) {
      return NextResponse.json({ success: false, message: 'Only images are allowed' }, { status: 400 });
    }

    // Ініціалізація GridFS і отримання db
    const gfs = await getGridFSBucket();
    const db = await connectToDatabase();

    // Видалення старого аватара, якщо він існує
    const existingAvatar = await Avatar.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (existingAvatar) {
      const oldFileId = existingAvatar.avatarUrl.split('/').pop();
      if (mongoose.Types.ObjectId.isValid(oldFileId)) {
        try {
          await gfs.delete(new mongoose.Types.ObjectId(oldFileId));
          console.log('Deleted old avatar file:', oldFileId);
        } catch (error) {
          console.error('Error deleting old avatar file:', error);
        }
      }
    }

    // Конвертація File у Readable Stream
    const buffer = Buffer.from(await avatarFile.arrayBuffer());
    const stream = Readable.from(buffer);

    // Завантаження файлу в GridFS
    const uploadStream = gfs.openUploadStream(`${userId}_${avatarFile.name}`, {
      contentType: avatarFile.type || 'image/jpeg',
      metadata: { userId },
    });

    await new Promise((resolve, reject) => {
      stream.pipe(uploadStream)
        .on('error', (error) => {
          console.error('GridFS upload error:', error);
          reject(error);
        })
        .on('finish', () => {
          console.log('GridFS upload finished:', uploadStream.id);
          resolve(null);
        });
    });

    // Перевірка, чи файл зберігся в GridFS
    const uploadedFile = await gfs.find({ _id: uploadStream.id }).toArray();
    if (!uploadedFile.length) {
      console.log('File not found in GridFS:', uploadStream.id);
      return NextResponse.json({ success: false, message: 'Failed to save file' }, { status: 500 });
    }
    console.log('GridFS file saved:', uploadedFile[0]);

    // Перевірка чанків
    const chunks = await db.collection('avatars.chunks').find({ files_id: uploadStream.id }).toArray();
    if (!chunks.length) {
      console.log('No chunks found for file:', uploadStream.id);
      await gfs.delete(uploadStream.id);
      return NextResponse.json({ success: false, message: 'Failed to save file chunks' }, { status: 500 });
    }
    console.log('Chunks saved:', chunks.length);

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
  } catch (error: unknown) {
    console.error('Error uploading avatar:', error);
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// Обробник для отримання аватарки
export async function GET(req: NextRequest) {
  try {
    const gfs = await getGridFSBucket();

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('id');

    console.log('Fetching avatar with fileId:', fileId);

    if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
      console.log('Invalid file ID:', fileId);
      return NextResponse.json({ success: false, message: 'Invalid file ID' }, { status: 400 });
    }

    const files = await gfs.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
    if (!files.length) {
      console.log('File not found in GridFS:', fileId);
      return NextResponse.json({ success: false, message: 'File not found' }, { status: 404 });
    }

    console.log('Found file in GridFS:', files[0]);

    const downloadStream = gfs.openDownloadStream(new mongoose.Types.ObjectId(fileId));

    // Обробка помилок потоку
    downloadStream.on('error', (error) => {
      console.error('Download stream error:', error);
      downloadStream.destroy();
    });

    // Перевірка, чи потік читається
    let dataReceived = false;
    downloadStream.on('data', () => {
      dataReceived = true;
      console.log('Download stream data received for fileId:', fileId);
    });

    downloadStream.on('end', () => {
      if (!dataReceived) {
        console.log('No data received from download stream:', fileId);
      }
    });

    return new NextResponse(downloadStream as unknown as ReadableStream, {
      status: 200,
      headers: {
        'Content-Type': files[0].contentType || 'image/jpeg',
        'Cache-Control': 'no-cache',
        'Content-Length': files[0].length.toString(),
      },
    });
  } catch (error: unknown) {
    console.error('Error retrieving avatar:', error);
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
