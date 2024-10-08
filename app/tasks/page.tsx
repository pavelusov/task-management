"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Typography, List, ListItem, ListItemText, Button, TextField, CircularProgress } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Stack } from "@mui/system";
import moment, { Moment } from "moment";
import { taskService } from "@/service/task-service";

export default function Tasks() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [newDeadline, setNewDeadline] = useState<Moment | null>(null);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDeadline, setEditTaskDeadline] = useState<Moment | null>(null);
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    if (session) {
      fetchTasks();
    }
  }, [session, status]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    const res = await taskService.add({ title: newTask, deadline: newDeadline })

    if (res.ok) {
      setNewTask('');
      setNewDeadline(null);

      if (session) {
        fetchTasks();
      }
    }
  };

  const handleEditTask = async (id: number, title: string, deadline: string | null) => {
    setEditTaskId(id);
    setEditTaskTitle(title);
    setEditTaskDeadline(deadline ? moment(deadline) : null);
  };

  const handleUpdateTask = async () => {
    if (!editTaskId || !editTaskTitle.trim()) return;

    const res = await taskService.update({
      id: editTaskId,
      title: editTaskTitle,
      deadline: editTaskDeadline,
    });

    if (res.ok) {
      setEditTaskId(null);
      setEditTaskTitle('');
      setEditTaskDeadline(null);

      if (session) {
        fetchTasks();
      }
    }
  };

  const handleDeleteTask = async (id: number) => {
    const res = await taskService.delete(id);

    if (res.ok && session) {
      fetchTasks();
    }
  };

  if (loading || status === 'loading') return <CircularProgress />;

  return (
    <Box sx={{ mt: 8, }} >
      <Typography variant="h4" gutterBottom>Your Tasks</Typography>

      <Stack spacing={2} direction="row">
        <TextField
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          label="New Task"
          margin="normal"
        />
        <DesktopDatePicker
          label="Set Deadline"
          value={newDeadline}
          onChange={(date) => setNewDeadline(date)}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
        <Button variant="outlined" onClick={handleAddTask} sx={{ mb: 2 }}>
          Add Task
        </Button>
      </Stack>
      {tasks.length > 0 ? (
        <List>
          {tasks.map((task) => (
            <ListItem key={task.id}>
              {editTaskId === task.id ? (
                <Stack spacing={2} direction="row">
                  <TextField
                    value={editTaskTitle}
                    onChange={(e) => setEditTaskTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <DesktopDatePicker
                    label="Edit Deadline"
                    value={editTaskDeadline}
                    onChange={(date) => setEditTaskDeadline(date)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  />
                </Stack>
              ) : (
                <ListItemText
                  primary={task.title}
                  secondary={task.deadline ? `Deadline: ${new Date(task.deadline).toLocaleDateString()}` : 'No deadline'}
                />
              )}

              {editTaskId === task.id ? (
                <Button onClick={handleUpdateTask}>Update</Button>
              ) : (
                <>
                  <Button onClick={() => handleEditTask(task.id, task.title, task.deadline)}>Edit</Button>
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
