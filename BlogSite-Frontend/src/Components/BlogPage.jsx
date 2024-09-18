import React, {useContext, useEffect, useState} from "react";
import {BlogContext} from "../App";
import BlogServices from "../services/blogs";
import LikeServices from "../services/likes";

const BlogPage = () => {
  const {
    currentBlogId,
    token,
    userLikedBlogs,
    isLoggedIn,
    currentUser,
    setUserLikedBlogs,
  } = useContext(BlogContext);
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchBlogById = async () => {
      if (!currentBlogId || !token) return;

      setIsLoading(true);
      try {
        const fetchedBlog = await BlogServices.getBlogById(
          currentBlogId,
          token
        );
        setBlog(fetchedBlog);
        setError(null);
        setIsLiked(userLikedBlogs.includes(fetchedBlog.id));
				console.log(userLikedBlogs)
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError("Failed to load blog. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogById();
  }, [currentBlogId, token, userLikedBlogs]);

  useEffect(() => {
    const fetchUserLikedBlogs = async () => {
      if (currentUser) {
        try {
          const responseData = await BlogServices.getUserLikedBlogs(
            currentUser.id,
            token
          );
          const likedBlogIds = responseData.map((blog) => blog.id);
          setUserLikedBlogs(likedBlogIds);
          console.log(
            "Liked blogs' IDs of",
            currentUser.username,
            likedBlogIds
          );
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchUserLikedBlogs();
  }, [currentUser, token, isLoggedIn]);

  const handleLike = async (blogId, userId) => {
    try {
      if (isLiked) {
        // Remove like
        await LikeServices.removeLike(blogId, userId, token);
        setBlog((prevBlog) => ({
          ...prevBlog,
          likesCount: prevBlog.likesCount - 1,
        }));
        setUserLikedBlogs((prevLikedBlogs) =>
          prevLikedBlogs.filter((id) => id !== blogId)
        );
      } else {
        // Add like
        await LikeServices.addLike(blogId, userId, token);
        setBlog((prevBlog) => ({
          ...prevBlog,
          likesCount: prevBlog.likesCount + 1,
        }));
        setUserLikedBlogs((prevLikedBlogs) => [...prevLikedBlogs, blogId]);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!blog) return <p>No blog found</p>;

  return (
    <div>
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
      <p>Written by: {blog.blogger.username}</p>
      <p>Category: {blog.category}</p>
      <div className="mt-6">
        <p>Tags:</p>
        {blog.tags.length > 0 ? (
          blog.tags.map((tag, index) => <p key={index}>{tag}</p>)
        ) : (
          <p>No tags available</p>
        )}
      </div>
      <div className="mt-6">
        <p>Comments:</p>
        {blog.comments.length > 0 ? (
          blog.comments.map((comment) => (
            <div key={comment.id}>
              <p>{comment.user}</p>
              <p>{comment.content}</p>
              <p>{comment.dateCreated}</p>
            </div>
          ))
        ) : (
          <p>No comments available</p>
        )}
      </div>
      <p className="mt-6">Likes: {blog.likesCount}</p>
      <button
        onClick={() => handleLike(blog.id, currentUser.id)}
        className="border border-black px-2 py-1"
      >
        {isLiked ? "Unlike" : "Like"}
      </button>
      <p>Created on: {blog.dateCreated}</p>
      {blog.dateUpdated && <p>Updated: {blog.dateUpdated}</p>}
    </div>
  );
};

export default BlogPage;
