import {Link} from "react-router-dom";
import BlogTags from "./BlogTags";

const BlogInfo = ({
  blog,
  handleDelete,
  currentUser,
  isLiked,
  handleLike,
  handleEditBlog,
}) => {
  return (
    <>
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
      <p>
        Written by: <Link to="/blogs/blogger">{blog.blogger.username}</Link>
      </p>
      <p>Category: {blog.category}</p>
      <p className="mt-6">Likes: {blog.likesCount}</p>
      <button
        onClick={() => handleLike(blog.id, currentUser.id)}
        className="border border-black px-2 py-1"
      >
        {isLiked ? "Unlike" : "Like"}
      </button>
      <p>Created on: {blog.dateCreated}</p>
      {blog.dateUpdated && <p>Updated: {blog.dateUpdated}</p>}
      {blog.blogger.id === currentUser.id && (
        <>
          <button
            className="border border-black px-1 py-2"
            onClick={handleEditBlog}
          >
            Edit Blog
          </button>{" "}
          <button
            className="border border-black px-1 py-2"
            onClick={handleDelete}
          >
            Delete Blog
          </button>
        </>
      )}
    </>
  );
};

export default BlogInfo;
