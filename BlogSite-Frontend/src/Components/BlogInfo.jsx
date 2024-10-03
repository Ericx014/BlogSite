import {Link} from "react-router-dom";

const BlogInfo = ({blog}) => {
  return (
    <div className="px-5 py-3">
      <p className="font-bold text-lg">
        <Link to="/blogs/blogger">{blog.blogger.username}</Link>
      </p>
      <p className="opacity-70 leading-3 mb-3">{blog.blogger.email}</p>
      <h1 className="font-bold text-2xl tracking-wide">{blog.title}</h1>
      <p className="mb-5">{blog.content}</p>
      <p className="opacity-70">Created on: {blog.dateCreated}</p>
      {blog.dateUpdated && <p>Updated: {blog.dateUpdated}</p>}
    </div>
  );
};

export default BlogInfo;
