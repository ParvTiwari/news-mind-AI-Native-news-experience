import axios from 'axios';
import { auth } from '../firebase';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api`
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getNews({ userId, interests, roleType }) {
  const params = {};
  if (userId) params.userId = userId;
  if (interests?.length) params.interests = interests.join(',');
  if (roleType) params.roleType = roleType;

  const response = await api.get('/getNews', { params });
  return response.data;
}

export async function askNews({ question, userId }) {
  const response = await api.post('/askNews', { question, userId });
  return response.data;
}

export async function getUserProfile(userId) {
  const response = await api.get(`/profile/${userId}`);
  return response.data.profile;
}

export async function saveUserInterests({ userId, interests }) {
  const response = await api.post('/profile/interests', { userId, interests });
  return response.data.profile;
}

export default api;
