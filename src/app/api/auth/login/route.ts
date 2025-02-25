import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json({ error: 'Ввкдите емейл или пароль' }, { status: 400 });
        }

        // Connect to database
        await connectDB();

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Пользователь не найденный' }, { status: 404 });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Неправильный пароль' }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email,
                role: user.role
            }, 
            JWT_SECRET, 
            { expiresIn: '7d' }
        );

        // Create response with cookie
        const response = NextResponse.json({ 
            success: true,
            redirect: '/dashboard'
        });

        // Set authentication token as an HTTP-only cookie
        response.cookies.set('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/'
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}