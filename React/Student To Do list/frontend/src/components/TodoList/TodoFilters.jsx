import './TodoList.css';

const TodoFilters = ({ filter, onFilterChange, todoCounts, onClearCompleted }) => {
  const filters = [
    { key: 'all', label: 'All', count: todoCounts.all },
    { key: 'active', label: 'Active', count: todoCounts.active },
    { key: 'completed', label: 'Completed', count: todoCounts.completed },
  ];

  return (
    <div className="todo-filters">
      <div className="filter-buttons">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            className={`filter-btn ${filter === key ? 'active' : ''}`}
            onClick={() => onFilterChange(key)}
          >
            {label}
            <span className="filter-count">{count}</span>
          </button>
        ))}
      </div>
      
      {todoCounts.completed > 0 && (
        <button className="clear-completed-btn" onClick={onClearCompleted}>
          Clear Completed
        </button>
      )}
    </div>
  );
};

export default TodoFilters;
