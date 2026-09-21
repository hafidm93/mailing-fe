import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_USERS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ success: true, data: INITIAL_USERS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newUser = {
      id: `usr-${Date.now()}`,
      status: 'active',
      lastLoginAt: 'Never',
      createdAt: new Date().toISOString(),
      ...body,
    };
    return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create user' }, { status: 400 });
  }
}
