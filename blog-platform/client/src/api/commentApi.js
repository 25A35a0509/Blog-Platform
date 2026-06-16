import axiosInstance from './axiosInstance';

export const getComments = async (postId) => {
  const { data } = await axiosInstance.get(`/comments/${postId}`);
  return data.data;
};

export const addComment = async (postId, text) => {
  const { data } = await axiosInstance.post(`/comments/${postId}`, { text });
  return data.data;
};

export const deleteComment = async (commentId) => {
  const { data } = await axiosInstance.delete(`/comments/${commentId}`);
  return data.data;
};
