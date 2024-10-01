import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {BlogContext} from "../App";
import BlogInfo from "./BlogInfo";
import BlogComments from "./BlogComments";
import BlogServices from "../services/blogs";
import LikeServices from "../services/likes";
import CommentServices from "../services/comments";
import EditBlogForm from "./EditBlogForm";
import BlogTags from "./BlogTags";

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
  const [commentInput, setCommentInput] = useState("");
  const [isEditBlog, setIsEditBlog] = useState(false);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

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
        setContent(fetchedBlog.content);
        setCategory(fetchedBlog.category);
        setError(null);
        setIsLiked(userLikedBlogs.includes(fetchedBlog.id));
        console.log(userLikedBlogs);
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
        await LikeServices.removeLike(blogId, userId, token);
        setBlog((prevBlog) => ({
          ...prevBlog,
          likesCount: prevBlog.likesCount - 1,
        }));
        setUserLikedBlogs((prevLikedBlogs) =>
          prevLikedBlogs.filter((id) => id !== blogId)
        );
      } else {
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
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentInput.trim()) {
      console.log("Comment input cannot be empty");
      return;
    }

    const newComment = {
      content: commentInput,
    };

    try {
      const responseData = await CommentServices.addComment(
        newComment,
        blog.id,
        currentUser.id,
        token
      );
      console.log(newComment);
      setBlog((prevBlog) => ({
        ...prevBlog,
        comments: [
          ...prevBlog.comments,
          {
            id: responseData.id,
            user: responseData.author,
            content: responseData.content,
            dateCreated: responseData.dateCreated,
          },
        ],
      }));
      setCommentInput("");
      console.log(responseData);
    } catch (e) {
      console.error(e);
    }
  };
  const handleCommentEdit = async (commentId, newContent) => {
		if (!newContent.trim()) {
      console.log("Comment input cannot be empty");
      return;
    }
		
		const editedComment = {
      content: newContent,
    };

    try {
      await CommentServices.editComment(
        commentId,
        currentUser.id,
        editedComment,
        token
      );
      setBlog({
        ...blog,
        comments: blog.comments.map((comment) =>
          comment.id === commentId ? {...comment, content: newContent} : comment
        ),
      });
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };
  const handleCommentDelete = async (commentId) => {
    try {
      await CommentServices.deleteComment(commentId, currentUser.id, token);
      setBlog((prevBlog) => ({
        ...prevBlog,
        comments: prevBlog.comments.filter(
          (comment) => comment.id !== commentId
        ),
      }));
      console.log("Deleted successfully", commentId);
    } catch (e) {
      console.error(e);
    }
  };
  const handleDelete = async () => {
    try {
      await BlogServices.deleteBlog(blog.id, currentUser.id, token);
      navigate("/blogs");
    } catch (e) {
      console.error(e);
    }
  };
  const startEdit = () => {
    setIsEditBlog(true);
  };
  const handleEditBlog = async (e) => {
    e.preventDefault();
    try {
      const updatedBlog = {
        ...blog,
        content,
        category,
      };
      await BlogServices.updateBlog(
        updatedBlog,
        currentUser.id,
        blog.id,
        token
      );
      setBlog(updatedBlog);
      setIsEditBlog(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!blog) return <p>No blog found</p>;

  return (
    <div>
      {!isEditBlog ? (
        <>
          <BlogInfo
            blog={blog}
            handleDelete={handleDelete}
            currentUser={currentUser}
            isLiked={isLiked}
            handleLike={handleLike}
            handleEditBlog={startEdit}
						setBlog={setBlog}
          />
          <BlogComments
            blog={blog}
            handleAddComment={handleAddComment}
            commentInput={commentInput}
            setCommentInput={setCommentInput}
            handleCommentDelete={handleCommentDelete}
            handleCommentEdit={handleCommentEdit}
            currentUser={currentUser}
          />
        </>
      ) : (
        <EditBlogForm
          blog={blog}
          handleEditBlog={handleEditBlog}
          content={content}
          setContent={setContent}
          category={category}
          setCategory={setCategory}
        />
      )}
      <button
        onClick={() => console.log(blog)}
        className="border border-black px-2 py-1"
      >
        Blog deets
      </button>
    </div>
  );
};

export default BlogPage;
