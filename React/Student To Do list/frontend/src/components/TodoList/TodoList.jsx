import { useState, useEffect, useMemo } from 'react';
import AddTodo from './AddTodo';
import TodoItem from './TodoItem';
import TodoFilters from './TodoFilters';
import { useTodos } from '../../hooks/useApi';
import { FiCheckSquare } from 'react-icons/fi';
import './TodoList.css';

const TodoList = ({ onTodoChange }) => {
  const { 
    todos, 
    loading, 
    fetchTodos, 
    createTodo, 
    toggleTodo, 
    updateTodo, 
    deleteTodo,
    clearCompleted 
  } = useTodos();
  
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAdd = async (text, priority) => {
    await createTodo(text, priority);
    if (onTodoChange) onTodoChange();
  };

  const handleToggle = async (id) => {
    await toggleTodo(id);
    if (onTodoChange) onTodoChange();
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    if (onTodoChange) onTodoChange();
  };

  const handleUpdate = async (id, data) => {
    await updateTodo(id, data);
  };

  const handleClearCompleted = async () => {
    await clearCompleted();
    if (onTodoChange) onTodoChange();
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const todoCounts = useMemo(() => ({
    all: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  }), [todos]);

  if (loading && todos.length === 0) {
    return <div className="loading">Initializing system...</div>;
  }

  return (
    <div className="todo-list-container">
      <div className="todo-list-header">
        <h2>/Tasks</h2>
      </div>
      
      <AddTodo onAdd={handleAdd} />
      
      <TodoFilters 
        filter={filter}
        onFilterChange={setFilter}
        todoCounts={todoCounts}
        onClearCompleted={handleClearCompleted}
      />
      
      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            {filter === 'all' 
              ? "> No tasks found. Create one to begin." 
              : filter === 'active'
              ? "> All active tasks cleared."
              : "> No completed tasks archive."}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
