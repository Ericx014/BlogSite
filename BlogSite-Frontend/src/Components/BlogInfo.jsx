import {Link} from "react-router-dom";
import BlogTags from "./BlogTags";

const BlogInfo = ({
  blog,
  handleDelete,
  currentUser,
  isLiked,
  handleLike,
  handleEditBlog,
	setBlog
}) => {
  return (
    <>
      <div className="flex flex-col leading-tight">
        <p className="font-bold text-lg">
          <Link to="/blogs/blogger">{blog.blogger.username}</Link>
        </p>
        <p className="opacity-70">{blog.blogger.email}</p>
      </div>
      <h1 className="font-bold text-2xl tracking-wide">{blog.title}</h1>
      <p>{blog.content}</p>
      <BlogTags blog={blog} setBlog={setBlog} />
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