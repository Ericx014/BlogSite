import {BrowserRouter, Routes, Route} from "react-router-dom";
import {useState, useEffect, createContext} from "react";
import Blogs from "./Components/Blogs";
import Login from "./Components/Login";
import Register from "./Components/Register";
import BlogForm from "./Components/BlogForm";
import BlogPage from "./Components/BlogPage";
import BloggerPage from "./Components/BloggerPage";
import BlogServices from "./services/blogs";
import SearchBlogs from "./Components/SearchBlogs";

export const BlogContext = createContext();

const App = () => {
  const [allBlogs, setAllBlogs] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [userLikedBlogs, setUserLikedBlogs] = useState([]);

  const storedLogInStatus =
    JSON.parse(localStorage.getItem("logInStatus")) || false;
  const [isLoggedIn, setIsLoggedIn] = useState(storedLogInStatus);

  const storedUser = JSON.parse(localStorage.getItem("blogUser")) || null;
  const [currentUser, setCurrentUser] = useState(storedUser);

  const storedToken = JSON.parse(localStorage.getItem("blogsiteToken")) || null;
  const [token, setToken] = useState(storedToken);

  const storedCurrentBlogId =
    JSON.parse(localStorage.getItem("currentBlogId")) || null;
  const [currentBlogId, setCurrentBlogId] = useState(storedCurrentBlogId);

  // useEffect(() => {
  //   const clearLocalStorage = () => {
  //     localStorage.clear();
  //   };
  //   window.addEventListener("beforeunload", clearLocalStorage);
  //   return () => {
  //     window.removeEventListener("beforeunload", clearLocalStorage);
  //   };
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (storedToken && isLoggedIn) {
        try {
          const allBlogsData = await BlogServices.getAllBlogs(storedToken);
          setAllBlogs(allBlogsData);
          if (storedUser) {
            const userBlogsData = await BlogServices.getUserBlogs(storedToken);
            setUserBlogs(userBlogsData);
          }
        } catch (error) {
          console.error("Failed to fetch blogs:", error);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <BlogContext.Provider
        value={{
          token,
          setToken,
          allBlogs,
          setAllBlogs,
          userBlogs,
          setUserBlogs,
          username,
          setUsername,
          password,
          setPassword,
          notification,
          setNotification,
          notificationType,
          setNotificationType,
          currentUser,
          setCurrentUser,
          currentBlogId,
          setCurrentBlogId,
          isLoggedIn,
          setIsLoggedIn,
          userLikedBlogs,
          setUserLikedBlogs,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route index element={<Login />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blogform" element={<BlogForm />} />
            <Route path="/blogs/blogpage" element={<BlogPage />} />
            <Route path="/blogs/blogger" element={<BloggerPage />} />
            <Route path="/search" element={<SearchBlogs />} />
          </Routes>
        </BrowserRouter>
      </BlogContext.Provider>
    </>
  );
};

export default App;
