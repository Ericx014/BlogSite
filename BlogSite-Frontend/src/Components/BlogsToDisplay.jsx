import { useContext } from "react";
import { BlogContext } from "../App";
import {useNavigate} from "react-router-dom";

const BlogsToDisplay = ({blogs}) => {
	const {setCurrentBlogId} = useContext(BlogContext)
  const navigate = useNavigate();

  const handleBlogSelect = (blogId) => {
    localStorage.setItem("currentBlogId", JSON.stringify(blogId));
    setCurrentBlogId(blogId);
    navigate("/blogs/blogpage");
  };

  return (
    <section className="">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="cursor-pointer border-b-[1px] border-gray-700 px-8 py-4 hover:bg-gray-900 transition-all"
          onClick={() => handleBlogSelect(blog.id)}
        >
          <div className="flex flex-col leading-4 mb-2">
            <h4 className="font-semibold text-lg tracking-wide">
              @{blog.blogger}
            </h4>
            <p className="text-gray-500">{blog.bloggerEmail}</p>
          </div>
          <p className="font-bold text-xl tracking-wide">{blog.title}</p>
          <p>{blog.content}</p>
        </div>
      ))}
    </section>
  );
};
export default BlogsToDisplay;
