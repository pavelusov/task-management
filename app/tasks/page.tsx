"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Typography, List, ListItem, ListItemText, Button, TextField, CircularProgress } from '@mui/material';

export default function Tasks() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        console.log('fetchTasks', data)
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

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask }),
    });

    if (res.ok) {
      const { message } = await res.json();
      console.log(message);
      setNewTask('');
      router.replace('/tasks'); // Перезагрузка задач
    }
  };

  const handleEditTask = async (id: number, title: string) => {
    setEditTaskId(id);
    setEditTaskTitle(title);
  };

  const handleUpdateTask = async () => {
    if (!editTaskId || !editTaskTitle.trim()) return;

    const res = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editTaskId, title: editTaskTitle }),
    });

    if (res.ok) {
      const { message } = await res.json();
      console.log(message);
      setEditTaskId(null);
      setEditTaskTitle('');
      router.refresh(); // Перезагрузка задач
    }
  };

  const handleDeleteTask = async (id: number) => {
    const res = await fetch('/api/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const { message } = await res.json();
      console.log(message);
      router.refresh(); // Перезагрузка задач
    }
  };

  if (loading || status === 'loading') return <CircularProgress />;

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>Your Tasks</Typography>

      <TextField
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        label="New Task"
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleAddTask} sx={{ mb: 2 }}>
        Add Task
      </Button>

      {tasks.length > 0 ? (
        <List>
          {tasks.map((task) => (
            <ListItem key={task.id}>
              {editTaskId === task.id ? (
                <TextField
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              ) : (
                <ListItemText primary={task.title} />
              )}

              {editTaskId === task.id ? (
                <Button onClick={handleUpdateTask}>Update</Button>
              ) : (
                <>
                  <Button onClick={() => handleEditTask(task.id, task.title)}>Edit</Button>
                  <Button onClick={() => handleDeleteTask(task.id)}>Delete</Button>
                </>
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No tasks available.</Typography>
      )}
    </Box>
  );
}
