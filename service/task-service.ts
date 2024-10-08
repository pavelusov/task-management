import {AddTaskParam, UpdateTaskParam} from "@/types/task";

export const taskService = {
  async delete(id: number) {
    return await fetch('/api/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
  },
  async update({ id, title, deadline }: UpdateTaskParam) {
    return await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        title,
        deadline: deadline ? deadline.toISOString() : null,
      }),
    });
  },
  async add({ title, deadline }: AddTaskParam) {
    return await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, deadline: deadline ? deadline.toISOString() : null }),
    });
  },
}