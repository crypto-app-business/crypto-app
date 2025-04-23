import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import connectDB from '@/utils/connectDB';

function nodeToWebStream(nodeStream: NodeJS.ReadableStream): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      nodeStream.on('data', (chunk) => controller.enqueue(chunk));
      nodeStream.on('end', () => controller.close());
      nodeStream.on('error', (err) => controller.error(err));
    },
  });
}

export async function GET(request: NextRequest, context: { params: { id: string } }) {
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
    const webStream = nodeToWebStream(stream);

    const headers = new Headers();
    headers.set('Content-Type', fileDoc.contentType || 'application/octet-stream');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(webStream, { headers });
  } catch (error) {
    console.error('🔥 GridFS read error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
