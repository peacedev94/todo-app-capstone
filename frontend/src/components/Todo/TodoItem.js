import React, { useState } from 'react';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || ''
  });

  const handleToggleComplete = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(todo.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: todo.title,
      description: todo.description || ''
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      onDelete(todo.id);
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="todo-edit">
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleChange}
            className="edit-title"
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleChange}
            className="edit-description"
            placeholder="Description..."
          />
          <div className="edit-actions">
            <button onClick={handleSave} className="btn btn-sm btn-primary">
              Save
            </button>
            <button onClick={handleCancel} className="btn btn-sm btn-outline">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="todo-content">
          <div className="todo-main">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggleComplete}
              className="todo-checkbox"
            />
            <div className="todo-text">
              <h3 className="todo-title">{todo.title}</h3>
              {todo.description && (
                <p className="todo-description">{todo.description}</p>
              )}
              <div className="todo-meta">
                <span className="todo-date">
                  Created: {new Date(todo.created_at).toLocaleDateString()}
                </span>
                {todo.updated_at !== todo.created_at && (
                  <span className="todo-date">
                    Updated: {new Date(todo.updated_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="todo-actions">
            <button onClick={handleEdit} className="btn btn-sm btn-outline">
              Edit
            </button>
            <button onClick={handleDelete} className="btn btn-sm btn-danger">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
