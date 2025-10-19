// frontend/src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUserByEmail = async (email) => {
  try {
    console.log('Fetching user by email:', email); // Debug log
    const response = await apiClient.get(`/users/by-email/${encodeURIComponent(email)}`);
    console.log('Server response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('User not found (404)'); // Debug log
      return null;
    }
    console.error('API Error:', error.message, error.response?.data); // Debug log
    throw error;
  }
};

export const createUser = async (profileData) => {
  const response = await apiClient.post('/users/', profileData);
  return response.data;
};

export const findMatch = async (userId) => {
  const response = await apiClient.post('/match/', { user_id: userId, filters: {} });
  return response.data;
};

export const getMentorChats = async (mentorId) => {
  const response = await apiClient.get(`/mentors/${mentorId}/chats`);
  return response.data;
};

// --- NEW FUNCTIONS ---
export const updateUser = async (userId, profileData) => {
  const response = await apiClient.put(`/users/${userId}`, profileData);
  return response.data;
};

export const deleteUser = async (userId) => {
  await apiClient.delete(`/users/${userId}`);
};

export const getAllUsers = async () => {
  const response = await apiClient.get('/users/');
  return response.data;
};

export default apiClient;