import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';

export async function POST(request: Request) {
    try {
        // Parse request body
        const body = await request.json();
        const { firstName, lastName, username, email, phone, country, password, referrer } = body;

        // Validate input
        if (!firstName || !lastName || !email || !username || !password || !phone || !country) {
            return NextResponse.json({ error: 'Всі поля повині бути заповнені' }, { status: 400 });
        }

        // Connect to database
        await connectDB();
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            phone,
            country,
            password: hashedPassword,
            password2: password,
            referrer,
          });
        await newUser.save();

        return NextResponse.json({ success: true, message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}