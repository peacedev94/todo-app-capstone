import React, { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../../services/api';
import TodoItem from './TodoItem';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const todosData = await getTodos();
      setTodos(todosData);
    } catch (err) {
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      const todo = await createTodo(newTodo);
      setTodos([todo, ...todos]);
      setNewTodo({ title: '', description: '' });
    } catch (err) {
      setError('Failed to create todo');
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const updatedTodo = await updateTodo(id, updates);
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleChange = (e) => {
    setNewTodo({
      ...newTodo,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="loading">Loading todos...</div>;
  }

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>My Todos</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="todo-form">
          <div className="form-row">
            <input
              type="text"
              name="title"
              placeholder="Todo title..."
              value={newTodo.title}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description (optional)"
              value={newTodo.description}
              onChange={handleChange}
            />
            <button type="submit" className="btn btn-primary">
              Add Todo
            </button>
          </div>
        </form>
      </div>

      <div className="todo-list">
        {todos.length === 0 ? (
          <div className="empty-state">
            <p>No todos yet. Create your first todo above!</p>
          </div>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
