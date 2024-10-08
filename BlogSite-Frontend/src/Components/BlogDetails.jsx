const BlogDetails = ({
  blog,
  isLiked,
  handleLike,
  currentUser,
}) => {
  return (
    <div className="flex flex-row items-center px-5 py-2">
      <button
        onClick={() => handleLike(blog.id, currentUser.id)}
        className="border border-black"
      >
        {isLiked ? "Unlike" : "Like"}
      </button>
      <p>
        {": "}
        {blog.likesCount}
      </p>
    </div>
  );
};
export default BlogDetails;
