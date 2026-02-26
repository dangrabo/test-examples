import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getNotes = () =>
  axios.get(`${BASE_URL}/notes`).then((r) => r.data);

export const createNote = (data) =>
  axios.post(`${BASE_URL}/notes`, data).then((r) => r.data);

export const deleteNote = (id) =>
  axios.delete(`${BASE_URL}/notes/${id}`);
