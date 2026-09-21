import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CAMPAIGNS } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  let list = [...INITIAL_CAMPAIGNS];
  if (projectId && projectId !== 'all') {
    list = list.filter((c) => c.projectId === projectId);
  }

  return NextResponse.json({ success: true, data: list });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newCampaign = {
      id: `cmp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      sentCount: 0,
      openCount: 0,
      clickCount: 0,
      status: body.status || 'draft',
      ...body,
    };

    return NextResponse.json({ success: true, data: newCampaign });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create campaign' }, { status: 400 });
  }
}
