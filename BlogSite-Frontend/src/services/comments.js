import axios from "axios";
const baseUrl = "http://localhost:5007";

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

// Add only commentors and blogger can delete the comment
const deleteComment = async (commentId, token) => {
  const response = await axios.delete(`${baseUrl}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {addComment, deleteComment};
