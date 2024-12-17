import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function GET(request) {
  const token = request.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    return NextResponse.json(user);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
