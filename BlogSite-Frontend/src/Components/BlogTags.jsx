import {useState, useContext} from "react";
import TagServices from "../services/tags";
import {BlogContext} from "../App";
import Tag from "./Tag";

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
              className="border border-black px-2 py-1"
              type="text"
              value={newTagContent}
              placeholder="Enter new tag"
              onChange={(e) => setNewTagContent(e.target.value)}
            />
            <button
              className="border border-black px-3 py-1 ml-2"
              type="submit"
            >
              Add
            </button>
          </form>
        )}
        <Tag
          blog={blog}
          handleRemoveTag={handleRemoveTag}
          isAddTag={isAddTag}
          setIsAddTag={setIsAddTag}
        />
      </div>
    </>
  );
};

export default BlogTags;