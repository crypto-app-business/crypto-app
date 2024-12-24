// import { NextResponse } from 'next/server';
// import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import User from '@/models/User';

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// export async function POST(request: Request) {
//     try {
//         // Parse request body
//         const body = await request.json();
//         const { email, password } = body;

//         // Validate input
//         if (!email || !password) {
//             return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
//         }

//         // Connect to database
//         await mongoose.connect(process.env.MONGO_URI!, {});

//         // Find user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return NextResponse.json({ error: 'Invalid credentials 1' }, { status: 401 });
//         }

//         // Compare passwords
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return NextResponse.json({ error: 'Invalid credentials 2' }, { status: 401 });
//         }

//         // Generate JWT token
//         const token = jwt.sign(
//             { 
//                 id: user._id, 
//                 email: user.email,
//                 role: user.role
//             }, 
//             JWT_SECRET, 
//             { expiresIn: '7d' }
//         );

//         // Create response with cookie
//         const response = NextResponse.json({ 
//             success: true,
//             redirect: '/dashboard',
//             user: {
//                 id: user._id,
//                 email: user.email,
//                 nickname: user.nickname,
//                 role: user.role
//             }
//         });

//         // Set authentication token as an HTTP-only cookie
//         response.cookies.set('authToken', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//             maxAge: 7 * 24 * 60 * 60, // 7 days
//             path: '/'
//         });

//         return response;
//     } catch (error) {
//         console.error('Login error:', error);
//         return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//     }
// }


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
            referrer,
          });
        await newUser.save();

        return NextResponse.json({ success: true, message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}