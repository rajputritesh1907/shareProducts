'use server';

import { createLink, getLinks } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export async function generateShareLink(productId: string, name: string, type: 'normal' | 'promotional') {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const newLink = await createLink(productId, name, type, session.userId as string);
    revalidatePath('/admin');

    // Must serialize Mongoose objects properly before returning to client components
    return JSON.parse(JSON.stringify(newLink));
}

export async function fetchAllLinks() {
    const session = await getSession();
    if (!session) return [];

    const links = await getLinks(session.userId as string);
    return JSON.parse(JSON.stringify(links));
}
