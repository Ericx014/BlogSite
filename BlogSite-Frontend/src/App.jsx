import {BrowserRouter, Routes, Route} from "react-router-dom";
import {useContext, useState, useEffect, createContext} from "react";
import HomePage from "./Components/HomePage";
import Login from "./Components/Login";
import Register from "./Components/Register";
import BlogPage from "./Components/BlogPage";
import BloggerPage from "./Components/BloggerPage";
import BlogServices from "./services/blogs";
import SearchBlogs from "./Components/SearchBlogs";
import useLocalStorage from "./Components/hooks/useLocalStorage";

export const BlogContext = createContext();

const App = () => {
  const [allBlogs, setAllBlogs] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [userLikedBlogs, setUserLikedBlogs] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("loginStatus", false);
  const [currentUser, setCurrentUser] = useLocalStorage("blogUser", null);
  const [token, setToken] = useLocalStorage("blogsiteToken", null)
  const [currentBlogId, setCurrentBlogId] = useLocalStorage(
    "currentBlogId",
    null
  );

  const [blogsToShow, setBlogToShow] = useState("explore");
  const [displayBlogs, setDisplayBlogs] = useState([...allBlogs]);

  useEffect(() => {
    const fetchData = async () => {
      if (token && isLoggedIn) {
        try {
          const allBlogsData = await BlogServices.getAllBlogs(token);
          setAllBlogs(allBlogsData);
          if (currentUser) {
            const userBlogsData = await BlogServices.getUserBlogs(token);
            setUserBlogs(userBlogsData);
          }
        } catch (error) {
          console.error("Failed to fetch blogs:", error);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserBlogs();
      fetchAllBlogs();
    }
  }, [token]);

  const fetchUserBlogs = async () => {
    if (token) {
      try {
        const responseData = await BlogServices.getUserBlogs(token);
        setUserBlogs(responseData);
        console.log(responseData);
      } catch (error) {
        console.error("Failed to fetch user blogs:", error);
      }
    }
  };

  const fetchAllBlogs = async () => {
    if (token) {
      try {
        const responseData = await BlogServices.getAllBlogs(token);
        setAllBlogs(responseData);
      } catch (error) {
        console.error("Failed to fetch all blogs:", error);
      }
    }
  };

  useEffect(() => {
    if (blogsToShow === "explore") {
      setDisplayBlogs(allBlogs);
    } else if (blogsToShow === "my posts") {
      const filteredBlogs = allBlogs.filter(
        (blog) => blog.blogger === currentUser.username
      );

      setDisplayBlogs(filteredBlogs);
    }
  }, [blogsToShow, allBlogs, userBlogs]);

  return (
    <section className="font-roboto bg-black text-white flex justify-center">
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
          blogsToShow,
          displayBlogs,
          setBlogToShow,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route index element={<Login />} />
            <Route path="/blogs" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blogs/blogpage" element={<BlogPage />} />
            <Route path="/blogs/blogger" element={<BloggerPage />} />
            <Route path="/search" element={<SearchBlogs />} />
          </Routes>
        </BrowserRouter>
      </BlogContext.Provider>
    </section>
  );
};

export const useRootContext = () => {
  return useContext(BlogContext);
};

export default App;
