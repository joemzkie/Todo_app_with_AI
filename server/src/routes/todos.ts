import { Router, Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../../../shared/types';

const router = Router();
const DATA_FILE = path.join(__dirname, '../../data/todos.json');

async function readTodos(): Promise<Todo[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeTodos(todos: Todo[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
}

// GET / - return all todos
router.get('/', async (_req: Request, res: Response) => {
  try {
    const todos = await readTodos();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read todos' });
  }
});

// POST / - create a new todo
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, priority, tags, dueDate } = req.body as CreateTodoRequest;

    if (!title || title.trim().length < 1) {
      return res.status(400).json({ error: 'Title is required and must be at least 1 character' });
    }

    const newTodo: Todo = {
      id: uuidv4(),
      title: title.trim(),
      completed: false,
      priority: priority || 'medium',
      tags: tags || [],
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
    };

    const todos = await readTodos();
    todos.push(newTodo);
    await writeTodos(todos);

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PATCH /:id - update a todo
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body as UpdateTodoRequest;

    const todos = await readTodos();
    const todoIndex = todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updatedTodo: Todo = { ...todos[todoIndex], ...updates };
    todos[todoIndex] = updatedTodo;
    await writeTodos(todos);

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /:id - delete a todo
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const todos = await readTodos();
    const todoIndex = todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todos.splice(todoIndex, 1);
    await writeTodos(todos);

    res.status(200).json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

export default router;
