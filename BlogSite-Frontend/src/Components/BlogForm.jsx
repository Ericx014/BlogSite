import {useState, useContext, useRef, useEffect} from "react";
import {BlogContext} from "../App";
import BlogServices from "../services/blogs";
import AutoTextArea from "./AutoTextArea";
import RoundBlueButton from "./RoundBlueButton";

const BlogForm = () => {
  const {token, currentUser} = useContext(BlogContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  // const navigate = useNavigate();

  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleCreate = async (e) => {
    e.preventDefault();

    const newBlog = {
      blog: {title, content, category},
			tags: null,
      userId: currentUser.id,
    };

    try {
      const responseData = await BlogServices.createBlog(newBlog, token);
      console.log("Blog created:", responseData);
      setTitle("");
      setContent("");
      setCategory("");
    } catch (e) {
      console.e("Failed to created blog", e);
    }
  };

  return (
    <section className="border-b-[2px] border-gray-700">
      <form onSubmit={handleCreate}>
        <AutoTextArea
          overwriteClass="p-8 text-xl"
          ref={textareaRef}
          placeholder="Tell us your story!"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex items-center justify-center w-full mb-5">
          <div className="border-t-[1px] flex-grow rounded-full border-gray-700"></div>
        </div>
        <div className="w-full flex ml-8 gap-6">
          <input
            required
            type="text"
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="focus:placeholder-transparent focus:outline-none border border-gray-600 bg-black rounded-md h-10 w-56 px-3"
          />
          <input
            required
            className="focus:placeholder-transparent focus:outline-none border border-gray-600 bg-black rounded-md h-10 w-56 px-3"
            placeholder="Category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="flex justify-end h-fit w-full">
          <RoundBlueButton text="Post" overwriteClass="w-24 h-8 m-8" />
        </div>
      </form>
    </section>
  );
};
export default BlogForm;
