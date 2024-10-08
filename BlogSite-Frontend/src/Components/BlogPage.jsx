import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {BlogContext} from "../App";
import BlogInfo from "./BlogInfo";
import BlogComments from "./BlogComments";
import BlogServices from "../services/blogs";
import LikeServices from "../services/likes";
import CommentServices from "../services/comments";
import BlogTags from "./BlogTags";
import BlogDetails from "./BlogDetails";
import Divider from "./Divider";
import Sidebar from "./Sidebar";

const BlogPage = () => {
  const {
    currentBlogId,
    token,
    userLikedBlogs,
    isLoggedIn,
    currentUser,
    setUserLikedBlogs,
		setBlogToShow
  } = useContext(BlogContext);
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentInput, setCommentInput] = useState("");
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
        setError(null);
        setIsLiked(userLikedBlogs.includes(fetchedBlog.id));
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const formatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return formatter.format(date);
  };

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
  const handleEditBlog = async (e, updatedContent) => {
    e.preventDefault();
    try {
      const updatedBlog = {
        ...blog,
        content: updatedContent,
      };
      await BlogServices.updateBlog(
        updatedBlog,
        currentUser.id,
        blog.id,
        token
      );
      setBlog(updatedBlog);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) return <p className="h-screen">Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!blog) return <p>No blog found</p>;

  return (
    <section className="w-[50rem] border border-gray-700 min-h-screen flex flex-row">
      <Sidebar />
      <div className="ml-[15rem] w-[70%]">
        <BlogInfo
          blog={blog}
          handleDelete={handleDelete}
          currentUser={currentUser}
          isLiked={isLiked}
          handleLike={handleLike}
          handleEditBlog={handleEditBlog}
          formatDate={formatDate}
        />
        <Divider />
        <BlogDetails
          blog={blog}
          isLiked={isLiked}
          handleEditBlog={handleEditBlog}
          handleDelete={handleDelete}
          currentUser={currentUser}
          handleLike={handleLike}
          formatDate={formatDate}
        />
        <Divider />
        <BlogTags blog={blog} setBlog={setBlog} />
        <Divider />
        <BlogComments
          blog={blog}
          handleAddComment={handleAddComment}
          commentInput={commentInput}
          setCommentInput={setCommentInput}
          handleCommentDelete={handleCommentDelete}
          handleCommentEdit={handleCommentEdit}
          currentUser={currentUser}
          formatDate={formatDate}
        />
      </div>
    </section>
  );
};

export default BlogPage;
