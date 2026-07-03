import type { Todo, CreateTodoRequest, UpdateTodoRequest, ChatMessage } from '../../shared/types';

const BASE_URL = '/api/todos';

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error('Failed to fetch todos');
  }
  return res.json();
}

export async function createTodo(data: CreateTodoRequest): Promise<Todo> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create todo' }));
    throw new Error(err.error || 'Failed to create todo');
  }
  return res.json();
}

export async function updateTodo(id: string, data: UpdateTodoRequest): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update todo' }));
    throw new Error(err.error || 'Failed to update todo');
  }
  return res.json();
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to delete todo' }));
    throw new Error(err.error || 'Failed to delete todo');
  }
}

export async function sendChatMessage(message: string, history: ChatMessage[]): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to get response' }));
    throw new Error(err.error || 'Failed to get response');
  }
  const data = await res.json();
  return data.reply;
}
