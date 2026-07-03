import { useState, useEffect, useMemo } from 'react';
import type { Todo, Priority } from '../../shared/types';
import { fetchTodos, updateTodo, deleteTodo } from './api';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterBar from './components/FilterBar';
import ThemeToggle from './components/ThemeToggle';
import ChatPanel from './components/ChatPanel';
import styles from './App.module.css';

type StatusFilter = 'all' | 'active' | 'completed';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [tagFilter, setTagFilter] = useState('all');

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      setLoading(true);
      setError('');
      const data = await fetchTodos();
      setTodos(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    todos.forEach((todo) => todo.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (statusFilter === 'active' && todo.completed) return false;
      if (statusFilter === 'completed' && !todo.completed) return false;
      if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;
      if (tagFilter !== 'all' && !todo.tags.includes(tagFilter)) return false;
      return true;
    });
  }, [todos, statusFilter, priorityFilter, tagFilter]);

  const handleAdd = (todo: Todo) => {
    setTodos((prev) => [todo, ...prev]);
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      const updated = await updateTodo(id, { completed });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err: any) {
      setError(err.message || 'Failed to update todo');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete todo');
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>📝 Todo App</h1>
          <p className={styles.subtitle}>
            {todos.length} {todos.length === 1 ? 'todo' : 'todos'} total,{' '}
            {todos.filter((t) => !t.completed).length} active
          </p>
        </div>
        <ThemeToggle />
      </header>

      <TodoForm onAdd={handleAdd} />

      <FilterBar
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        tagFilter={tagFilter}
        availableTags={availableTags}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onTagChange={setTagFilter}
      />

      {error && (
        <div className={styles.error} role="alert">
          <p>{error}</p>
          <button onClick={() => setError('')} className={styles.dismissBtn}>Dismiss</button>
        </div>
      )}

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading todos...</p>
        </div>
      )}

      {!loading && !error && filteredTodos.length === 0 && (
        <div className={styles.empty}>
          {todos.length === 0 ? (
            <p>No todos yet! Add one above. ☝️</p>
          ) : (
            <p>No todos match your filters.</p>
          )}
        </div>
      )}

      {!loading && filteredTodos.length > 0 && (
        <TodoList todos={filteredTodos} onToggle={handleToggle} onDelete={handleDelete} />
      )}

      <ChatPanel />
    </div>
  );
}
