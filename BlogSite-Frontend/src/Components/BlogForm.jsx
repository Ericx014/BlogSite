import {useState, useContext, useRef, useEffect} from "react";
import {BlogContext} from "../App";
// import {useNavigate} from "react-router-dom";
import BlogServices from "../services/blogs";

const BlogForm = () => {
  const {token, currentUser, setAllBlogs} = useContext(BlogContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  // const navigate = useNavigate();

  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleCreate = async (e) => {
    e.preventDefault();

    const newBlog = {
      blog: {title, content, category},
      tags: tags.split(",").map((tag) => tag.trim()),
      userId: currentUser.id,
    };

    try {
      const responseData = await BlogServices.createBlog(newBlog, token);
      console.log("Blog created:", responseData);
      setTitle("");
      setContent("");
      setCategory("");
      setTags("");
      // navigate("/blogs");
    } catch (e) {
      console.e("Failed to created blog", e);
    }
  };

  return (
    <section className="border-b-[2px] border-gray-700">
      <form onSubmit={handleCreate}>
        <textarea
          id="content"
          placeholder="Tell us your story!"
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="focus:outline-none bg-transparent resize-none text-xl w-full p-8"
        ></textarea>
        <div className="flex items-center justify-center w-full mb-5">
          <div className="border-t-[1px] flex-grow rounded-full border-gray-700"></div>
        </div>
        <div>
          <input
            type="text"
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="focus:placeholder-transparent focus:outline-none border border-gray-600 bg-black rounded-md h-10 w-64 ml-6 px-3"
          />
          <input
            className="focus:placeholder-transparent focus:outline-none border border-gray-600 bg-black rounded-md h-10 w-64 ml-6 px-3"
            placeholder="Category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="flex justify-end h-fit w-full">
          <button
            type="submit"
            className="bg-[#1d9bf0] font-semibold rounded-full w-24 h-8 m-8"
          >
            Post
          </button>
        </div>
      </form>
    </section>
  );
};
export default BlogForm;
