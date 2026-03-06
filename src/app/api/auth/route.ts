import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { setSession, clearSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { action, email, password, name } = await request.json();
        await connectDB();

        if (action === 'logout') {
            await clearSession();
            return NextResponse.json({ success: true });
        }

        if (action === 'signup') {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return NextResponse.json({ error: 'User already exists' }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ email, password: hashedPassword, name });

            await setSession(user._id.toString(), user.email);
            return NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
        }

        if (action === 'login') {
            const user = await User.findOne({ email });
            if (!user) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            await setSession(user._id.toString(), user.email);
            return NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error('Auth Error:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
