import axios from "axios";
const baseUrl = "http://localhost:5007";

// Get all tags

// Get tags by blogId
const getTags = async (token, blogId) => {
  const response = await axios.get(`${baseUrl}/tags/${blogId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Add tags
const addTag = async (token, blogId, userId, tag) => {
  const response = await axios.post(
    `${baseUrl}/blogs/${blogId}/tags/${userId}`,
    tag,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Remove tags
const removeTag = async (token, blogId, userId, tagName) => {
  const response = await axios.delete(
    `${baseUrl}/blogs/${blogId}/tags/${tagName}/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default {getTags, addTag, removeTag};
