import {Link} from "react-router-dom";
import BlogTags from "./BlogTags";

const BlogInfo = ({
  blog,
  handleDelete,
  currentUser,
  isLiked,
  handleLike,
  handleEditBlog,
  setBlog,
}) => {
  return (
    <>
      <div className="p-3">
        <p className="font-bold text-lg">
          <Link to="/blogs/blogger">{blog.blogger.username}</Link>
        </p>
        <p className="opacity-70 leading-3 mb-3">{blog.blogger.email}</p>
        <h1 className="font-bold text-2xl tracking-wide">{blog.title}</h1>
        <p className="mb-5">{blog.content}</p>
      </div>
      <div className="w-full border-t border-gray-700"></div>
    </>
  );
};

export default BlogInfo;