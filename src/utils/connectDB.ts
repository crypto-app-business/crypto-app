// utils/connectDB.ts
import mongoose from 'mongoose';
import { MongoClient, GridFSBucket } from 'mongodb';

// Змінна для зберігання GridFSBucket
let gfs: GridFSBucket | null = null;

const connectDB = async () => {
  // Перевіряємо, чи вже є підключення через mongoose
  if (mongoose.connections[0].readyState) {
    // Якщо підключення вже є, перевіряємо, чи ініціалізований gfs
    if (gfs) {
      return;
    }
  }

  // Підключаємося до MongoDB через mongoose
  await mongoose.connect(process.env.MONGO_URI!, {});

  // Чекаємо, поки підключення буде готове
  if (!mongoose.connection.db) {
    throw new Error('mongoose.connection.db не визначений. Переконайтеся, що підключення до MongoDB успішне.');
  }

  // Ініціалізація GridFS
  const client = new MongoClient(process.env.MONGO_URI!);
  await client.connect();
  const db = client.db(mongoose.connection.db.databaseName); // Отримуємо назву бази даних із mongoose
  gfs = new GridFSBucket(db, { bucketName: 'nftImages' }); // Ініціалізація GridFSBucket
};

// Функція для отримання gfs
export const getGfs = () => {
  if (!gfs) {
    throw new Error('GridFSBucket не ініціалізований. Спочатку викличте connectDB.');
  }
  return gfs;
};

export default connectDB;