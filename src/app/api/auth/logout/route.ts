import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Create response and clear the 'authToken' cookie
        const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

        // Видаляємо кукі, встановлюючи значення на порожній рядок та maxAge на 0
        response.cookies.set('authToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, // Негайно видаляє кукі
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
