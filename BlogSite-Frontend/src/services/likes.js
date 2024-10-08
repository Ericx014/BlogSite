import axios from "axios";
const baseUrl = "http://localhost:5007";

const addLike = async (blogId, userId, token) => {
  const response = await axios.post(`${baseUrl}/blogs/${blogId}/addlike/${userId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const removeLike = async (blogId, userId, token) => {
  const response = await axios.patch(`${baseUrl}/blogs/${blogId}/removelike/${userId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default { addLike, removeLike };