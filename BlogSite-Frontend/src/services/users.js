import axios from "axios";
const baseUrl = "https://localhost:44352/users";

const addUser = async (username, email, password) => {
  const response = await axios.post(baseUrl, {
    username,
    email,
    password,
  });
  return response.data;
};

export default {addUser};
