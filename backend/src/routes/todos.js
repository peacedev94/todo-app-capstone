const express = require('express');
const { getTodos, createTodo, updateTodo, deleteTodo } = require('../controllers/todoController');
const auth = require('../middleware/auth');

const router = express.Router();

// All todo routes require authentication
router.use(auth);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
