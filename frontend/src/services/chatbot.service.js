import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const sendChatMessage = async (message, conversationHistory = []) => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.post(
    `${API_BASE}/chatbot/message`,
    { message, conversationHistory },
    { headers }
  );

  return response.data;
};
