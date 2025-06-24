import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://13.53.134.21:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (email, password, name) => {
  const response = await api.post('/auth/register', { email, password, name });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

// Todo API
export const getTodos = async () => {
  const response = await api.get('/todos');
  return response.data;
};

export const createTodo = async (todo) => {
  const response = await api.post('/todos', todo);
  return response.data;
};

export const updateTodo = async (id, todo) => {
  const response = await api.put(`/todos/${id}`, todo);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};
