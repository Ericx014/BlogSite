import axios from "axios";
const baseUrl = "https://localhost:7130/blogs";

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

export default {
  getUserBlogs,
  getAllBlogs,
  getBlogById,
  createBlog,
  getUserLikedBlogs,
};
