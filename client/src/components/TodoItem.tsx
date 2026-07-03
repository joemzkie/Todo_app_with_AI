import type { Todo } from '../../../shared/types';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const isOverdue =
    todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date(new Date().toDateString());

  const priorityClass = styles[`priority_${todo.priority}`] || '';

  return (
    <div className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={todo.completed}
          onChange={() => onToggle(todo.id, !todo.completed)}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
      </label>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{todo.title}</span>
          <span className={`${styles.badge} ${priorityClass}`}>{todo.priority}</span>
        </div>
        <div className={styles.meta}>
          {todo.tags.length > 0 && (
            <div className={styles.tags}>
              {todo.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
          {todo.dueDate && (
            <span className={`${styles.dueDate} ${isOverdue ? styles.overdue : ''}`}>
              📅 {new Date(todo.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.title}"`}
        title="Delete todo"
      >
        ✕
      </button>
    </div>
  );
}
