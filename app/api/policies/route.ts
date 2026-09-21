import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_ACCESS_POLICIES } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ success: true, data: INITIAL_ACCESS_POLICIES });
}

export async function PUT(req: NextRequest) {
  try {
    const { role, permissions } = await req.json();
    return NextResponse.json({
      success: true,
      message: `Access policy for ${role} updated successfully`,
      data: { role, permissions },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update policy' }, { status: 400 });
  }
}
