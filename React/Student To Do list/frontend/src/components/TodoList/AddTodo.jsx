import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import './TodoList.css';

const AddTodo = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), priority);
      setText('');
      setPriority('medium');
    }
  };

  return (
    <form className="add-todo" onSubmit={handleSubmit}>
      <div className="add-todo-input-group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New Objective..."
          className="add-todo-input"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="priority-select"
        >
          <option value="high">Urgent</option>
          <option value="medium">Normal</option>
          <option value="low">Trivial</option>
        </select>
        <button type="submit" className="add-todo-btn">
          Create
        </button>
      </div>
    </form>
  );
};

export default AddTodo;
