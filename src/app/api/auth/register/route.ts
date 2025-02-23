import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function POST(request: Request) {
    try {
        // Parse request body
        const body = await request.json();
        const { firstName, lastName, username, email, phone, country, password, referrer } = body;

        // Validate input
        if (!firstName || !lastName || !email || !username || !password || !phone || !country) {
            return NextResponse.json({ error: 'Всі поля повинні бути заповнені' }, { status: 400 });
        }

        // Connect to database
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Email вже зареєстровано' }, { status: 400 });
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
            referrer,
        });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Create response and set auth token in HTTP-only cookie
        const response = NextResponse.json({ 
            success: true, 
            message: 'Користувач зареєстрований успішно', 
            userId: newUser._id 
        });

        response.cookies.set('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 днів
            path: '/'
        });

        return response;
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Внутрішня помилка сервера' }, { status: 500 });
    }
}