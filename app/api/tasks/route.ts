import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const sessionRes = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
    });

    const session = await sessionRes.json();

    // Проверяем, есть ли сессия
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const db = await openDb();
    const userId = session.user.id;

    // Получаем задачи пользователя
    const tasks = await db.all('SELECT * FROM tasks WHERE user_id = ?', [userId]);

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
