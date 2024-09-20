const EditBlogForm = ({
  blog,
  handleEditBlog,
  content,
  setContent,
  category,
  setCategory,
}) => {
  return (
    <form onSubmit={handleEditBlog}>
      <div>
        <h1>{blog.title}</h1>
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
      <button
        className="border border-black rounded-lg px-3 py-1"
        type="submit"
      >
        Edit
      </button>
    </form>
  );
};
export default EditBlogForm;
