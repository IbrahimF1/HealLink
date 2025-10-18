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
    const response = await apiClient.get(`/users/by-email/${email}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
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

export default apiClient;