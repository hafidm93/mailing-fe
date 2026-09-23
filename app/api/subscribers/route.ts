import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_SUBSCRIBERS } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  let list = [...INITIAL_SUBSCRIBERS];

  if (projectId && projectId !== 'all') {
    list = list.filter((s) => s.projectId === projectId);
  }

  if (status && status !== 'all') {
    list = list.filter((s) => s.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (s) =>
        s.email.toLowerCase().includes(q) ||
        (s.name || '').toLowerCase().includes(q) ||
        (s.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({ success: true, count: list.length, data: list });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newSubscriber = {
      id: `sub-${Date.now()}`,
      joinedAt: new Date().toISOString(),
      status: 'subscribed',
      totalEmailsReceived: 0,
      openRate: 0,
      tags: body.tags || ['landing-page'],
      ...body,
    };

    return NextResponse.json({ success: true, data: newSubscriber });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add subscriber' }, { status: 400 });
  }
}
