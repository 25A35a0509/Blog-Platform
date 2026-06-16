import axiosInstance from './axiosInstance';

/**
 * Uploads an image file to the backend (which forwards it to Cloudinary).
 * @param {File} file
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await axiosInstance.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.data;
};
