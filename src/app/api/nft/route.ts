// /api/nft
import { NextResponse } from 'next/server';
import NFT from '@/models/NFTSchema';
import User from '@/models/User';
import connectDB, { getGfs } from '@/utils/connectDB';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false, // Вимикаємо стандартний bodyParser, щоб обробляти multipart/form-data
  },
};

export async function POST(request) {
  try {
    await connectDB();
    const gfs = getGfs();

    // Отримуємо дані з форми
    const formData = await request.formData();
    const userId = formData.get('userId');
    const name = formData.get('name');
    const percentage = Number(formData.get('percentage'));
    const durationDays = Number(formData.get('durationDays'));
    const activationDays = Number(formData.get('activationDays'));
    const price = Number(formData.get('price'));
    const image = formData.get('image');

    // Перевірка, чи всі поля заповнені
    if (!userId || !name || !percentage || !durationDays || !activationDays || !price || !image) {
      return NextResponse.json({ error: 'Усі поля обов’язкові.' }, { status: 400 });
    }

    // Перевірка, чи користувач є адміністратором
    const user = await User.findById(userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Недостатньо прав.' }, { status: 403 });
    }

    // Завантаження зображення в GridFS
    const buffer = Buffer.from(await image.arrayBuffer());
    const stream = Readable.from(buffer);
    const uploadStream = gfs.openUploadStream(image.name);
    stream.pipe(uploadStream);

    const imageId = await new Promise((resolve, reject) => {
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.on('error', reject);
    });

    // Створення нового NFT
    const newNFT = await NFT.create({
      name,
      imageId,
      percentage,
      durationDays,
      activationDays,
      price,
    });

    return NextResponse.json({ success: true, data: newNFT });
  } catch (error) {
    console.error('Помилка створення NFT:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    // Отримуємо всі NFT
    const nfts = await NFT.find({});

    // Фільтруємо NFT, які ще доступні для активації
    const now = new Date();
    const availableNFTs = nfts.filter((nft) => {
      const createdAt = new Date(nft.createdAt);
      const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceCreation <= nft.activationDays;
    });

    return NextResponse.json({ success: true, data: availableNFTs });
  } catch (error) {
    console.error('Помилка отримання NFT:', error);
    return NextResponse.json({ error: 'Помилка сервера.' }, { status: 500 });
  }
}