'use client';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Проверяем статус сессии и если не аутентифицирован - перенаправляем на страницу входа
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        console.log('data', data)
        setTasks(data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchTasks();
    }
  }, [session, status]);

  if (status === 'loading' || loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Welcome {session?.user?.name || 'User'}
      </Typography>

      <Button variant="contained" color="primary" onClick={() => signOut()} sx={{ mb: 4 }}>
        Logout
      </Button>

      <Typography variant="h5" gutterBottom>Your Tasks</Typography>

      {tasks.length > 0 ? (
        <List>
          {tasks.map((task) => (
            <ListItem key={task.id}>
              <ListItemText primary={task.title} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No tasks available. Enjoy your free time!</Typography>
      )}
    </Box>
  );
}
