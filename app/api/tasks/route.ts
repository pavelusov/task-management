import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

const getServerSession = async (req: NextRequest) => {
  const sessionRes = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
    headers: {
      cookie: req.headers.get('cookie') || '',
    },
  });

  return await sessionRes.json();
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(req);

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

// Добавление новой задачи
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(req);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const db = await openDb();
    const userId = session.user.id;
    const { title, deadline } = await req.json();

    if (!title) {
      return NextResponse.json({ message: 'Task title is required' }, { status: 400 });
    }

    // Вставка новой задачи с дедлайном (если он указан)
    await db.run(
      'INSERT INTO tasks (user_id, title, deadline) VALUES (?, ?, ?)',
      [userId, title, deadline || null]
    );

    return NextResponse.json({ message: 'Task created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Редактирование существующей задачи
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(req);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const db = await openDb();
    const userId = session.user.id;
    const { id, title, completed, deadline } = await req.json();

    if (!id || !title) {
      return NextResponse.json({ message: 'Task ID and title are required' }, { status: 400 });
    }

    // Обновление задачи с новым дедлайном (если он указан)
    await db.run(
      'UPDATE tasks SET title = ?, completed = ?, deadline = ? WHERE id = ? AND user_id = ?',
      [title, completed ? 1 : 0, deadline || null, id, userId]
    );

    return NextResponse.json({ message: 'Task updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Удаление задачи
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(req);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const db = await openDb();
    const userId = session.user.id;
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'Task ID is required' }, { status: 400 });
    }

    // Удаление задачи из базы данных
    await db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
