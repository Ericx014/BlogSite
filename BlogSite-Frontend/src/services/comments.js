import axios from "axios";
const baseUrl = "https://localhost:7130";

const addComment = async (newComment, blogId, userId, token) => {
  const response = await axios.post(
    `${baseUrl}/comments/${blogId}/${userId}`,
    newComment,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default {addComment};
