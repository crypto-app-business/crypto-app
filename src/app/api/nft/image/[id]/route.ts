// /api/nft/image/[id]/route.ts
import { NextResponse } from 'next/server';
import connectDB, { getGfs } from '@/utils/connectDB';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const gfs = getGfs();

    const { id } = params;

    // Перевірка валідності ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Невалідний ID зображення.' }, { status: 400 });
    }

    // Перевірка, чи існує файл у GridFS
    const file = await gfs.find({ _id: new ObjectId(id) }).toArray();
    if (!file || file.length === 0) {
      return NextResponse.json({ error: 'Зображення не знайдено.' }, { status: 404 });
    }

    // Створюємо потік для читання зображення
    const downloadStream = gfs.openDownloadStream(new ObjectId(id));
    const chunks: Buffer[] = [];

    downloadStream.on('data', (chunk: Buffer) => chunks.push(chunk));
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      downloadStream.on('end', () => resolve(Buffer.concat(chunks)));
      downloadStream.on('error', reject);
    });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': file[0].contentType || 'image/jpeg',
      },
    });
  } catch (error) {
    console.error('Помилка отримання зображення:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}