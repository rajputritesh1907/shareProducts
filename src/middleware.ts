import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // Let the requests pass through naturally. 
    // We handle Authentication logic directly within the React Server Components now!
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
