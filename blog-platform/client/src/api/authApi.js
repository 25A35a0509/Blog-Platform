import axiosInstance from './axiosInstance';

export const register = async ({ name, email, password }) => {
  const { data } = await axiosInstance.post('/auth/register', { name, email, password });
  return data.data;
};

export const login = async ({ email, password }) => {
  const { data } = await axiosInstance.post('/auth/login', { email, password });
  return data.data;
};

export const getProfile = async () => {
  const { data } = await axiosInstance.get('/auth/profile');
  return data.data;
};

export const updateProfile = async (payload) => {
  const { data } = await axiosInstance.put('/auth/profile', payload);
  return data.data;
};
