import {useEffect, useContext, useState} from "react";
import {BlogContext} from "../App";
import {useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";
import BlogServices from "../services/blogs";

const Blogs = () => {
  const {
    username,
    setUsername,
    token,
    setToken,
    allBlogs,
    setAllBlogs,
		userBlogs,
    setUserBlogs,
    setNotification,
    setNotificationType,
  } = useContext(BlogContext);
  const navigate = useNavigate();
  const [blogsToShow, setBlogToShow] = useState("random");
  const [displayBlogs, setDisplayBlogs] = useState([...allBlogs]);

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
  useEffect(() => {
    fetchUserBlogs();
  }, [token]);

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
    fetchAllBlogs();
  }, [token]);

  useEffect(() => {
    if (blogsToShow == "random") {
      setDisplayBlogs(allBlogs);
    }
    if (blogsToShow == "myposts") {
      setDisplayBlogs(userBlogs);
    }
  }, [blogsToShow, allBlogs, userBlogs]);

  const userProfile = (
    <h1 className="font-bold text-lg mb-4">Username: {username}</h1>
  );

  const blogsToDisplay = displayBlogs.map((blog) => (
    <section key={blog.id} className="mb-5">
      <p>ID: {blog.id}</p>
      <p>Title: {blog.title}</p>
      <p>Content: {blog.content}</p>
      <p>Written by: {blog.blogger.username}</p>
      <div>
        {blog.comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>Comment ID: {comment.id}</p>
            <p>Content: {comment.content}</p>
            <p>Commented by: {comment.userId}</p>
          </div>
        ))}
      </div>
    </section>
  ));

  const handleLogout = () => {
    setToken("");
    setUserBlogs([]);
    setAllBlogs([]);
    setUsername("");
    setNotification("Logged out successfully");
    setNotificationType("success");
    navigate("/");
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
      <button
        className="bg-white border border-black rounded-lg px-2 py-1"
        onClick={() => setBlogToShow("random")}
      >
        Random
      </button>
      <button
        className="bg-white border border-black rounded-lg px-2 py-1"
        onClick={() => setBlogToShow("myposts")}
      >
        My Posts
      </button>
      <Link to="/blogform">
				<button className="bg-white border border-black rounded-lg px-2 py-1">
					Create blog
				</button>
			</Link>
      {blogsToDisplay}
      {logoutButton}
    </>
  );
};

export default Blogs;
