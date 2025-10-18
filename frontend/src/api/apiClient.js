// src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Your FastAPI backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Creates a user profile.
 * @param {Object} profileData - The user's profile data.
 * @returns {Promise<Object>} The created user profile from the backend.
 */
export const createUser = async (profileData) => {
  const response = await apiClient.post('/users/', profileData);
  return response.data;
};

/**
 * Finds the best mentor match for a given user.
 * @param {number} userId - The ID of the mentee.
 * @returns {Promise<Object>} An object containing the mentor and the introduction.
 */
export const findMatch = async (userId) => {
  const response = await apiClient.post('/match/', { user_id: userId, filters: {} });
  return response.data;
};

export const getMentorChats = async (mentorId) => {
  const response = await apiClient.get(`/mentors/${mentorId}/chats`);
  return response.data;
};


export default apiClient;
