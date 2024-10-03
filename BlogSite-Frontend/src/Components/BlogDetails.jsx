const BlogDetails = ({
  blog,
  isLiked,
  handleLike,
  handleEditBlog,
  handleDelete,
  currentUser,
}) => {
  return (
    <div className="px-5 py-2">
      <div className="flex flex-row items-center">
        <button
          onClick={() => handleLike(blog.id, currentUser.id)}
          className="border border-black"
        >
          {isLiked ? "Unlike" : "Like"}
        </button>
        <p>{": "}{blog.likesCount}</p>
      </div>
      {/* {blog.blogger.id === currentUser.id && (
        <>
          <button
            className="border border-black px-1 py-2"
            onClick={handleEditBlog}
          >
            Edit Blog
          </button>{" "}
          <button
            className="border border-black px-1 py-2"
            onClick={handleDelete}
          >
            Delete Blog
          </button>
        </>
      )} */}
    </div>
  );
};
export default BlogDetails;
