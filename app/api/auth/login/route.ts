import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_USERS } from '@/lib/mock-data';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Async delay simulation for realistic backend integration
    await new Promise((resolve) => setTimeout(resolve, 300));

    const user = INITIAL_USERS.find(
      (u) => u.username.toLowerCase() === (username || '').toLowerCase()
    );

    // Simple demo auth check: password matches "<username>123" or "admin" / "password"
    if (user && (password === `${user.username}123` || password === 'admin123' || password === 'password')) {
      return NextResponse.json({
        success: true,
        user: {
          ...user,
          lastLoginAt: new Date().toISOString(),
        },
        token: `jwt_session_${user.id}_${Date.now()}`,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid username or password. Use demo quick-login or username123.' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
