import {useState, useContext} from "react";
import TagServices from "../services/tags";
import {BlogContext} from "../App";

const BlogTags = ({blog, setBlog}) => {
  const {token, currentUser} = useContext(BlogContext);
  const [newTagContent, setNewTagContent] = useState([]);
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
  return (
    <>
      <div className="mt-6">
        {isAddTag && (
          <form onSubmit={handleAddTag}>
            <input
              className="border border-black"
              type="text"
              value={newTagContent}
              placeholder="Enter new tag"
              onChange={(e) => setNewTagContent(e.target.value)}
            />
            <button
              className="border border-black px-3"
              type="submit"
              onClick={handleAddTag}
            >
              Add
            </button>
          </form>
        )}
        <p>Tags:</p>
        {blog.tags.length > 0 ? (
          blog.tags.map((tag, index) => <p key={index}>{tag}</p>)
        ) : (
          <p>No tags available</p>
        )}
      </div>
      <button
        className="border border-black px-1 py-2"
        onClick={() => setIsAddTag(!isAddTag)}
      >
        {isAddTag ? "Cancel" : "Add a tag"}
      </button>
    </>
  );
};

export default BlogTags;
