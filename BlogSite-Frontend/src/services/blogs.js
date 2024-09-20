import axios from "axios";
const baseUrl = "http://localhost:5007/blogs";

const getUserBlogs = async (token) => {
  const response = await axios.get(`${baseUrl}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getAllBlogs = async (token) => {
  const response = await axios.get(baseUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const createBlog = async (newBlog, token) => {
  const response = await axios.post(baseUrl, newBlog, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getBlogById = async (blogId, token) => {
  const response = await axios.get(`${baseUrl}/${blogId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getUserLikedBlogs = async (userId, token) => {
  const response = await axios.get(`${baseUrl}/${userId}/userliked`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deleteBlog = async (userId, blogId, token) => {
  const response = await axios.delete(`${baseUrl}/${userId}/${blogId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateBlog = async (updatedBlog, userId, blogId, token) => {
  const response = await axios.patch(
    `${baseUrl}/${blogId}/${userId}`,
    updatedBlog,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default {
  getUserBlogs,
  getAllBlogs,
  getBlogById,
  createBlog,
  getUserLikedBlogs,
  deleteBlog,
  updateBlog,
};
