const Todo = require('../models/Todo');

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.findByUserId(req.user.id);
    res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const todo = await Todo.create({
      title,
      description,
      userId: req.user.id
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const todo = await Todo.update(id, req.user.id, updates);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.delete(id, req.user.id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
