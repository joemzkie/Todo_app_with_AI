import type { Todo } from '../../../shared/types';
import TodoItem from './TodoItem';
import styles from './TodoList.module.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  return (
    <div className={styles.list} role="list" aria-label="Todo list">
      {todos.map((todo) => (
        <div key={todo.id} role="listitem">
          <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}
