import {useEffect, useContext} from "react";
import axios from "axios";
import {BlogContext} from "../App";
import {useNavigate} from "react-router-dom";

const Blogs = () => {
  const {username, setUsername, token, setToken, blogs, setBlogs} =
    useContext(BlogContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "https://localhost:44352/blogs/user",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setBlogs(response.data);
        } catch (error) {
          console.error("Failed to fetch blogs:", error);
        }
      }
    };

    fetchBlogs();
  }, [token]);

  const userProfile = (
    <h1 className="font-bold text-lg mb-4">Username: {username}</h1>
  );

  const blogsToDisplay = blogs.map((blog) => (
    <section key={blog.id} className="mb-5">
      <p>ID: {blog.id}</p>
      <p>Title: {blog.title}</p>
      <p>Content: {blog.content}</p>
      <div>
        {blog.comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>Comment ID: {comment.id}</p>
            <p>Content: {comment.content}</p>
            <p>Author: {comment.userId}</p>
          </div>
        ))}
      </div>
    </section>
  ));

  const handleLogout = () => {
    setToken("");
    setBlogs([]);
    setUsername("");
    navigate("/");
    console.log("Logged out");
  };

  const logoutButton = (
    <button
      className="border border-black rounded-md px-6 py-1"
      onClick={handleLogout}
    >
      Log Out
    </button>
  );

  return (
    <>
      {userProfile}
      {blogsToDisplay}
      {logoutButton}
    </>
  );
};

export default Blogs;
