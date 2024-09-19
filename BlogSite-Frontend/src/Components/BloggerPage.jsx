import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {BlogContext} from "../App";

const BloggerPage = () => {
  const {currentUser, setCurrentBlogId, userBlogs} = useContext(BlogContext);
  const navigate = useNavigate();

  const handleSelectBlog = (blogId) => {
    setCurrentBlogId(blogId);
    navigate("/blogs/blogpage");
  };

  return (
    <section>
      <h1>Blogger Profile</h1>
      <h4 className="mb-3">{currentUser.username}</h4>
      <h4 className="mb-3">{currentUser.email}</h4>
      <section>
        {userBlogs.map((blog) => (
          <div key={blog.id} onClick={() => handleSelectBlog(blog.id)} className="cursor-pointer">
            <h5>{blog.title}</h5>
            <h5>{blog.content}</h5>
          </div>
        ))}
      </section>
      <button onClick={() => console.log(currentUser)}>Click</button>
    </section>
  );
};
export default BloggerPage;
