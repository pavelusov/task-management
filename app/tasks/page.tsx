'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { useRouter } from "next/navigation";

export default function Tasks() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    const fetchTasks = async () => {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data.tasks);
      setLoading(false);
    };

    if (session) {
      fetchTasks();
    }
  }, [session, status]);

  if (loading || status === 'loading') return <CircularProgress />;

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>Your Tasks</Typography>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id}>
            <ListItemText primary={task.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
