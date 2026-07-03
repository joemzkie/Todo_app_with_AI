import { useState } from 'react';
import type { Todo, Priority } from '../../../shared/types';
import { createTodo } from '../api';
import styles from './TodoForm.module.css';

interface TodoFormProps {
  onAdd: (todo: Todo) => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [tagsInput, setTagsInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setSubmitting(true);
    try {
      const todo = await createTodo({
        title: title.trim(),
        priority,
        tags,
        dueDate: dueDate || null,
      });
      onAdd(todo);
      setTitle('');
      setPriority('medium');
      setTagsInput('');
      setDueDate('');
    } catch (err: any) {
      setError(err.message || 'Failed to add todo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Add todo">
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="todo-title" className={styles.label}>Title</label>
          <input
            id="todo-title"
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            disabled={submitting}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="todo-priority" className={styles.label}>Priority</label>
          <select
            id="todo-priority"
            className={styles.select}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            disabled={submitting}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="todo-tags" className={styles.label}>Tags</label>
          <input
            id="todo-tags"
            type="text"
            className={styles.input}
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Comma-separated (e.g. work, urgent)"
            disabled={submitting}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="todo-due" className={styles.label}>Due Date</label>
          <input
            id="todo-due"
            type="date"
            className={styles.input}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={submitting}
          />
        </div>
      </div>
      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Todo'}
        </button>
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </form>
  );
}
