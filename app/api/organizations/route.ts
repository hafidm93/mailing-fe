import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_ORGANIZATIONS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ success: true, data: INITIAL_ORGANIZATIONS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newOrg = {
      id: `org-${Date.now()}`,
      memberCount: 1,
      projectsCount: 0,
      createdAt: new Date().toISOString(),
      ...body,
    };
    return NextResponse.json({ success: true, data: newOrg });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create organization' }, { status: 400 });
  }
}
