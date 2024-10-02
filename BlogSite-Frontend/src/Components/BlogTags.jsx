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
    <>
      <div className="">
        {isAddTag && (
          <form onSubmit={handleAddTag}>
            <input
              className="border border-black px-2 py-1 text-black"
              type="text"
              value={newTagContent}
              placeholder="Enter new tag"
              onChange={(e) => setNewTagContent(e.target.value)}
            />
            <button
              className="border border-black px-3 py-1 ml-2"
              onClick={() => setIsAddTag(false)}
            >
              Cancel
            </button>
            <button
              className="border border-black px-3 py-1 ml-2"
              type="submit"
            >
              Add
            </button>
          </form>
        )}
        <div className="flex flex-row gap-2">
          {blog.tags && blog.tags.length > 0 ? (
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
          ) : (
            <p>No tags available</p>
          )}
          {!isAddTag && <button
            className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-black"
            onClick={() => setIsAddTag(!isAddTag)}
          >
            +
          </button>}
        </div>
      </div>
    </>
  );
};

export default BlogTags;