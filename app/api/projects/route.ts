import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PROJECTS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ success: true, data: INITIAL_PROJECTS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newProject = {
      id: `prj-${Date.now()}`,
      slug: (body.name || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
      subscriberCount: 0,
      activeCampaignsCount: 0,
      apiKey: `ml_live_${Math.random().toString(36).substring(2, 15)}`,
      ...body,
    };

    return NextResponse.json({ success: true, data: newProject });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create project' }, { status: 400 });
  }
}
