import React, {useContext, useEffect, useState} from "react";
import {BlogContext} from "../App";
import BlogServices from "../services/blogs";

const BlogPage = () => {
  const {currentBlogId, token} = useContext(BlogContext);
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError("Failed to load blog. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogById();
  }, [currentBlogId, token]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!blog) return <p>No blog found</p>;

  return (
    <div>
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
      <p>Written by: {blog.blogger.username}</p>
      <p>Category: {blog.category}</p>
      <div className="mt-3">
        <p>Tags:</p>
        {blog.tags.map((tag) => (
          <p key={tag.id}>{tag}</p>
        ))}
      </div>
      <p>Likes: {blog.likesCount}</p>
      <p>Created on: {blog.dateCreated}</p>
      {blog.dateUpdated ? <p>Updated:{blog.dateUpdated}</p> : <p></p>}
      {/* <p>Dislikes: {blog.dislikesCount}</p> */}
      <div className="mt-3">
        <p>Comments:</p>
        {blog.comments.map((comment) => (
          <div>
            <p>{comment.user}</p>
            <p>{comment.content}</p>
            <p>{comment.dateCreated}</p>
          </div>
        ))}
      </div>
      <button
        className="border border-black py-1 px-3 mt-6"
        onClick={() => console.log(blog)}
      >
        Press
      </button>
    </div>
  );
};

export default BlogPage;
