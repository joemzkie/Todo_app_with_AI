# 📝 Kiro Todo v2

A full-stack Todo application with AI chat assistance, built with React, Express, and the Gemini API.

## Features

- **CRUD Todos** — Create, read, update, and delete tasks
- **Priority Levels** — Assign high, medium, or low priority to each todo
- **Tags** — Organize todos with custom tags
- **Due Dates** — Set optional due dates for tasks
- **Filtering** — Filter by status (all/active/completed), priority, and tags
- **Dark/Light Theme** — Toggle between themes
- **AI Chat Panel** — Chat with a Gemini-powered assistant for help managing your tasks

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Client   | React 18, TypeScript, Vite          |
| Server   | Express, TypeScript, tsx            |
| AI       | Google Gemini API                   |
| Testing  | Vitest, Testing Library, Supertest  |
| Storage  | JSON file (`server/data/todos.json`) |

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- A [Google Gemini API key](https://ai.google.dev/)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd kiro-todo-v2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create or edit `server/.env`:

   ```
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

4. **Start development servers**

   ```bash
   npm run dev
   ```

   This starts both the Express server (port 3001) and the Vite dev server (port 5173) concurrently.

5. **Open the app**

   Navigate to [http://localhost:5173](http://localhost:5173)

## Scripts

| Command         | Description                              |
|-----------------|------------------------------------------|
| `npm run dev`   | Start client and server in dev mode      |
| `npm run build` | Build server and client for production   |
| `npm run test`  | Run tests for server and client          |

## Project Structure

```
kiro-todo-v2/
├── client/              # React frontend (Vite)
│   └── src/
│       ├── components/  # TodoForm, TodoList, TodoItem, FilterBar, ChatPanel, ThemeToggle
│       ├── api.ts       # API client functions
│       ├── App.tsx      # Main app component
│       └── theme.css    # Theme variables
├── server/              # Express backend
│   └── src/
│       ├── routes/
│       │   ├── todos.ts # CRUD endpoints for todos
│       │   └── chat.ts  # AI chat endpoint (Gemini)
│       └── index.ts     # Server entry point
├── shared/              # Shared TypeScript types
│   └── types.ts
└── package.json         # Workspace root
```

## API Endpoints

| Method | Endpoint        | Description          |
|--------|-----------------|----------------------|
| GET    | /api/todos      | List all todos       |
| POST   | /api/todos      | Create a new todo    |
| PUT    | /api/todos/:id  | Update a todo        |
| DELETE | /api/todos/:id  | Delete a todo        |
| POST   | /api/chat       | Send a chat message  |

## License

MIT
