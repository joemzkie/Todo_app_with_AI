export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  tags: string[];
  dueDate: string | null; // ISO date string or null
  createdAt: string; // ISO date string
}

export interface CreateTodoRequest {
  title: string;
  priority?: Priority;
  tags?: string[];
  dueDate?: string | null;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
  priority?: Priority;
  tags?: string[];
  dueDate?: string | null;
}


export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
}
