import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { openDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    const db = await openDb();
    const existingUser = await db.get('SELECT * FROM users WHERE username = ?', username);

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);

    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', username, hashedPassword);

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
