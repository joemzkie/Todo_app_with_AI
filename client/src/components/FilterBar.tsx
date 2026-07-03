import type { Priority } from '../../../shared/types';
import styles from './FilterBar.module.css';

type StatusFilter = 'all' | 'active' | 'completed';

interface FilterBarProps {
  statusFilter: StatusFilter;
  priorityFilter: 'all' | Priority;
  tagFilter: string;
  availableTags: string[];
  onStatusChange: (status: StatusFilter) => void;
  onPriorityChange: (priority: 'all' | Priority) => void;
  onTagChange: (tag: string) => void;
}

export default function FilterBar({
  statusFilter,
  priorityFilter,
  tagFilter,
  availableTags,
  onStatusChange,
  onPriorityChange,
  onTagChange,
}: FilterBarProps) {
  const statuses: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className={styles.bar} aria-label="Filter todos">
      <div className={styles.group}>
        <span className={styles.groupLabel}>Status:</span>
        <div className={styles.buttonGroup} role="group" aria-label="Filter by status">
          {statuses.map(({ value, label }) => (
            <button
              key={value}
              className={`${styles.filterBtn} ${statusFilter === value ? styles.active : ''}`}
              onClick={() => onStatusChange(value)}
              aria-pressed={statusFilter === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <label htmlFor="filter-priority" className={styles.groupLabel}>Priority:</label>
        <select
          id="filter-priority"
          className={styles.select}
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value as 'all' | Priority)}
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className={styles.group}>
        <label htmlFor="filter-tag" className={styles.groupLabel}>Tag:</label>
        <select
          id="filter-tag"
          className={styles.select}
          value={tagFilter}
          onChange={(e) => onTagChange(e.target.value)}
        >
          <option value="all">All</option>
          {availableTags.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
