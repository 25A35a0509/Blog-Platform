import axiosInstance from './axiosInstance';

/**
 * Fetch a paginated list of posts.
 * @param {object} params - { page, limit, search, category, tag, author, mine }
 */
export const getPosts = async (params = {}) => {
  const { data } = await axiosInstance.get('/posts', { params });
  return data; // { success, data, pagination }
};

export const getPostById = async (idOrSlug) => {
  const { data } = await axiosInstance.get(`/posts/${idOrSlug}`);
  return data.data;
};

export const createPost = async (payload) => {
  const { data } = await axiosInstance.post('/posts', payload);
  return data.data;
};

export const updatePost = async (id, payload) => {
  const { data } = await axiosInstance.put(`/posts/${id}`, payload);
  return data.data;
};

export const deletePost = async (id) => {
  const { data } = await axiosInstance.delete(`/posts/${id}`);
  return data.data;
};

export const toggleLike = async (id) => {
  const { data } = await axiosInstance.put(`/posts/${id}/like`);
  return data.data;
};

export const getCategories = async () => {
  const { data } = await axiosInstance.get('/posts/categories');
  return data.data;
};
