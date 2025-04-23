import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import connectDB from '@/utils/connectDB';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB(); // просто підключення

    const db = mongoose.connection.db!; // тут вже можна брати connection

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'avatars',
    });

    const fileId = new ObjectId(params.id);
    const fileDoc = await db.collection('avatars.files').findOne({ _id: fileId });

    if (!fileDoc) {
      return new Response('File not found', { status: 404 });
    }

    const stream = bucket.openDownloadStream(fileId);

    const headers = new Headers();
    headers.set('Content-Type', fileDoc.contentType || 'application/octet-stream');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(stream as any, { headers });
  } catch (error) {
    console.error('🔥 GridFS read error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
