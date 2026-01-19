import { useState } from 'react';
import { FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import './TodoList.css';

const TodoItem = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const priorityColors = {
    high: 'var(--danger)',
    medium: 'var(--warning)',
    low: 'var(--success)',
  };

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, { text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div 
        className="priority-indicator" 
        style={{ backgroundColor: priorityColors[todo.priority] }}
      />
      
      <label className="todo-checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span className="checkmark"></span>
      </label>

      {isEditing ? (
        <div className="todo-edit-group">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="todo-edit-input"
            autoFocus
          />
          <button onClick={handleSave} className="todo-btn save">
            <FiCheck />
          </button>
          <button onClick={handleCancel} className="todo-btn cancel">
            <FiX />
          </button>
        </div>
      ) : (
        <>
          <span className="todo-text" onDoubleClick={() => setIsEditing(true)}>
            {todo.text}
          </span>
          
          <div className="todo-actions">
            <span className={`priority-badge ${todo.priority}`}>
              {todo.priority}
            </span>
            <button 
              onClick={() => setIsEditing(true)} 
              className="todo-btn edit"
              title="Edit"
            >
              <FiEdit2 />
            </button>
            <button 
              onClick={() => onDelete(todo.id)} 
              className="todo-btn delete"
              title="Delete"
            >
              <FiTrash2 />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
