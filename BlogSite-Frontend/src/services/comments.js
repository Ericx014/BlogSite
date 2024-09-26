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

// Edit comment
const editComment = async (commentId, userId, comment, token) => {
  const response = await axios.patch(
    `${baseUrl}/comments/${commentId}/user/${userId}`,
    comment,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Add only commentors and blogger can delete the comment
const deleteComment = async (commentId, userId, token) => {
  const response = await axios.delete(
    `${baseUrl}/comments/${commentId}/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default {addComment, editComment, deleteComment};
