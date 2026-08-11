import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // If KV env vars are missing, we mock the result (useful for local dev)
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return NextResponse.json({ 
        count: 18258 + Math.floor(Math.random() * 50) - 25,
        mocked: true 
      });
    }

    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const now = Date.now();
    const thirtySecondsAgo = now - 30 * 1000;
    const kvKey = 'active_listeners';

    // 1. Remove listeners who haven't pinged in the last 30 seconds
    await kv.zremrangebyscore(kvKey, '-inf', thirtySecondsAgo);

    // 2. Add or update the current user's timestamp
    await kv.zadd(kvKey, { score: now, member: sessionId });

    // 3. Get the total count of active listeners
    const count = await kv.zcard(kvKey);

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error in presence API:', error);
    // Fallback on error to ensure frontend doesn't break
    return NextResponse.json({ 
      count: 18258,
      error: 'KV connection failed' 
    });
  }
}
