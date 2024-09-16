import axios from "axios";
const baseUrl = "https://localhost:7130/login";

const login = async (username, password) => {
  const response = await axios.post(baseUrl, {
    username,
    password
  });
  return response.data;
};
export default {login};
