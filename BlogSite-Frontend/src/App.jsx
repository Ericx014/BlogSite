import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import {useState, createContext} from "react";
import Blogs from "./Components/Blogs";
import Login from "./Components/Login";
import Register from "./Components/Register";

export const BlogContext = createContext();

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  return (
    <>
      <BlogContext.Provider
        value={{
          token,
          setToken,
          blogs,
          setBlogs,
          username,
          setUsername,
          password,
          setPassword,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route index element={<Login />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </BlogContext.Provider>
    </>
  );
};

export default App;
