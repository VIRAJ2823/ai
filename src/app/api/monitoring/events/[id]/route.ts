import { NextRequest, NextResponse } from 'next/server';
import { monitoringStore } from '@/lib/monitoringStore';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const body = await req.json();
    const { sessionId, challengeNotes } = body;

    if (!sessionId || !challengeNotes) {
      return NextResponse.json({ error: 'sessionId and challengeNotes are required' }, { status: 400 });
    }

    const updatedEvent = await monitoringStore.challengeEvent(eventId, sessionId, challengeNotes);

    if (!updatedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (error: any) {
    console.error('Error challenging event:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
