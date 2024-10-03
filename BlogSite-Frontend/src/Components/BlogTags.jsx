import {useState, useContext} from "react";
import TagServices from "../services/tags";
import {BlogContext} from "../App";

const BlogTags = ({blog, setBlog}) => {
  const {token, currentUser} = useContext(BlogContext);
  const [newTagContent, setNewTagContent] = useState("");
  const [isAddTag, setIsAddTag] = useState(false);

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTagContent.trim()) return;

    try {
      const tagToAdd = [newTagContent];
      const responseData = await TagServices.addTag(
        token,
        blog.id,
        currentUser.id,
        tagToAdd
      );
      setBlog((prevBlog) => ({
        ...prevBlog,
        tags: [...prevBlog.tags, newTagContent],
      }));

      console.log(responseData);
      setNewTagContent("");
      setIsAddTag(false);
    } catch (e) {
      console.error("Failed to add tag:", e);
    }
  };

  const handleRemoveTag = async (tagName) => {
    try {
      await TagServices.removeTag(token, blog.id, currentUser.id, tagName);
      setBlog((prevBlog) => ({
        ...prevBlog,
        tags: prevBlog.tags.filter((tag) => tag !== tagName),
      }));
    } catch (e) {
      console.error("Failed to remove tag:", e);
    }
  };

  return (
    <div className="px-5 py-3 pb-8 flex flex-col gap-2 border-b-[1px] border-gray-700">
      <p className="px-1 text-lg font-semibold">
        Blog category: {blog.category}
      </p>
      {isAddTag && (
        <form onSubmit={handleAddTag} className="">
          <input
            className="focus:outline-none border border-black px-4 py-1 text-black rounded-full"
            type="text"
            value={newTagContent}
            placeholder="Enter a tag"
            onChange={(e) => setNewTagContent(e.target.value)}
          />
          <button className="border border-black px-3 py-1 ml-2" type="submit">
            Add
          </button>
          <button
            className="border border-black px-3 py-1 ml-2"
            onClick={() => setIsAddTag(false)}
          >
            Cancel
          </button>
        </form>
      )}
      <div className="flex flex-row gap-2 items-center">
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 rounded-full px-3 py-1"
              >
                <span className="text-black">{tag}</span>
                <button
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveTag(tag)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {!isAddTag && blog.blogger.username == currentUser.username && (
          <button
            className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-black"
            onClick={() => setIsAddTag(!isAddTag)}
          >
            {blog.tags && blog.tags.length ? "+" : "Add a tag"}
          </button>
        )}
      </div>
    </div>
  );
};

export default BlogTags;
