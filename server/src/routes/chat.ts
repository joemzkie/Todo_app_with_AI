import { Router, Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Todo, ChatRequest } from '../../../shared/types';

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

function buildTodoContext(todos: Todo[]): string {
  const incomplete = todos.filter((t) => !t.completed);

  if (incomplete.length === 0) {
    return 'The user has no incomplete tasks. All tasks are done!';
  }

  const now = new Date();
  const lines = incomplete.map((todo) => {
    const parts = [`- "${todo.title}" (Priority: ${todo.priority})`];
    if (todo.tags.length > 0) {
      parts.push(`Tags: ${todo.tags.join(', ')}`);
    }
    if (todo.dueDate) {
      const due = new Date(todo.dueDate);
      const diffDays = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        parts.push(`OVERDUE by ${Math.abs(diffDays)} day(s)`);
      } else if (diffDays === 0) {
        parts.push(`Due TODAY`);
      } else {
        parts.push(`Due in ${diffDays} day(s)`);
      }
    }
    return parts.join(' | ');
  });

  return `The user has ${incomplete.length} incomplete task(s):\n${lines.join('\n')}`;
}

const SYSTEM_PROMPT = `You are a helpful productivity assistant embedded in a todo app. Your job is to help the user manage their tasks effectively.

Based on their current task list, you can:
- Suggest which task to tackle first and explain why
- Break large tasks into smaller, actionable steps
- Give time management tips tailored to their specific tasks
- Help them deal with overdue tasks without judgment
- Motivate them when they feel overwhelmed
- Suggest how to batch similar tasks together

Keep responses concise (2-4 sentences unless they ask for more detail), friendly, and actionable. Use the actual task names and details to give specific advice, not generic productivity tips. If they have no tasks, congratulate them and suggest planning ahead.`;

router.post('/', async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your-gemini-api-key-here') {
      return res.status(503).json({
        error: 'Chat assistant is not configured. Please set GEMINI_API_KEY in server/.env',
      });
    }

    const { message, history } = req.body as ChatRequest;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const todos = await readTodos();
    const todoContext = buildTodoContext(todos);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    // Build conversation history for Gemini
    const systemMessage = {
      role: 'user' as const,
      parts: [{ text: `${SYSTEM_PROMPT}\n\nCurrent task context:\n${todoContext}\n\nPlease acknowledge you understand your role and wait for my question.` }],
    };
    const systemResponse = {
      role: 'model' as const,
      parts: [{ text: 'Understood! I\'m your productivity assistant. I can see your tasks and I\'m ready to help. What would you like to work on?' }],
    };

    const chatHistory = [
      systemMessage,
      systemResponse,
      ...(history || []).slice(-10).map((msg) => ({
        role: (msg.role === 'assistant' ? 'model' : 'user') as 'model' | 'user',
        parts: [{ text: msg.content }],
      })),
    ];

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(message.trim());
    const reply = result.response.text();

    res.status(200).json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error.message || error);
    console.error('Full error:', JSON.stringify(error, null, 2));
    res.status(500).json({ error: `Failed to get response from assistant: ${error.message || 'Unknown error'}` });
  }
});

export default router;
