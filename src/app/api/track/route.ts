import { NextResponse } from 'next/server';
import { recordClick, recordOrder, recordSignup } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    try {
        const { action, refId } = await request.json();

        if (!refId) {
            return NextResponse.json({ error: 'Missing refId' }, { status: 400 });
        }

        let success = false;
        if (action === 'click') {
            success = await recordClick(refId);
        } else if (action === 'order') {
            success = await recordOrder(refId);
        } else if (action === 'signup') {
            success = await recordSignup(refId);
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        if (success) {
            revalidatePath('/admin');
        }

        return NextResponse.json({ success });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
