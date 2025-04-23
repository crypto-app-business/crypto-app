import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import connectDB from '@/utils/connectDB';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, context: any) {
  const { id } = context.params;

  if (!ObjectId.isValid(id)) {
    return new Response('Invalid ID format', { status: 400 });
  }

  try {
    await connectDB();

    const db = mongoose.connection.db!;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'avatars',
    });

    const fileId = new ObjectId(id);
    const fileDoc = await db.collection('avatars.files').findOne({ _id: fileId });

    if (!fileDoc) {
      return new Response('File not found', { status: 404 });
    }

    const stream = bucket.openDownloadStream(fileId);

    const webStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      },
    });

    const headers = new Headers();
    headers.set('Content-Type', fileDoc.contentType || 'application/octet-stream');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(webStream, { headers });
  } catch (error) {
    console.error('🔥 GridFS read error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
