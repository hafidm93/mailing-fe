import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { campaignId, recipientIds, projectId, sendRate } = await req.json();

    // Async backend processing simulation
    await new Promise((resolve) => setTimeout(resolve, 600));

    const recipientCount = Array.isArray(recipientIds) ? recipientIds.length : 0;
    const deliveredCount = Math.max(1, Math.floor(recipientCount * 0.98));
    const bounceCount = recipientCount - deliveredCount;

    return NextResponse.json({
      success: true,
      batchId: `batch_${Date.now()}`,
      campaignId,
      projectId,
      totalQueued: recipientCount,
      delivered: deliveredCount,
      bounced: bounceCount,
      status: 'dispatched',
      sentAt: new Date().toISOString(),
      message: `Successfully queued and dispatched email batch to ${recipientCount} subscribers.`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Bulk dispatch error' }, { status: 500 });
  }
}
