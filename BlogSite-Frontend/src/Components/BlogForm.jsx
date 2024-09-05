import {useState, useContext} from "react";
import {BlogContext} from "../App";
import {useNavigate} from "react-router-dom";
import BlogServices from "../services/blogs";

const BlogForm = () => {
  const {token, currentUser} = useContext(BlogContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();

    const newBlog = {
      blog: { title, content, category },
      tags: tags.split(",").map((tag) => tag.trim()),
      userId: currentUser.id,
    };

    const response = await BlogServices.createBlog(newBlog, token);
    console.log("Blog created:", response);
    setTitle("");
    setContent("");
    setCategory("");
    setTags("");
    navigate("/blogs");
  };

  return (
    <section>
      <h1 className="font-bold text-lg tracking-wide">Add a Blog</h1>
      <form onSubmit={handleCreate}>
        <div>
          <label>Title</label>
          <input
            className="border border-black rounded-md"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Content</label>
          <textarea
            className="border border-black rounded-md"
            type="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          <label>Category</label>
          <input
            className="border border-black rounded-md"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div>
          <label>Tags</label>
          <input
            className="border border-black rounded-md"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <button
          className="border border-black rounded-lg px-3 py-1"
          type="submit"
        >
          Create
        </button>
      </form>
    </section>
  );
};
export default BlogForm;
