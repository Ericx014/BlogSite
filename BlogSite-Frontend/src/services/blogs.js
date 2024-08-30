import axios from "axios";
const baseUrl = "https://localhost:44352/blogs";

const getUserBlogs = async (token) => {
	const response = await axios.get(`${baseUrl}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
	return response.data;
}

const getAllBlogs = async (token) => {
	const response = await axios.get(baseUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },	
	})
	return response.data;	
}

export default {getUserBlogs, getAllBlogs};