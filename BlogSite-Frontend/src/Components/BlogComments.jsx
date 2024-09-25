const BlogComments = ({
  blog,
  handleAddComment,
  commentInput,
  setCommentInput,
  handleCommentDelete,
  currentUser,
}) => {
  return (
    <div className="mt-6">
      <form onSubmit={handleAddComment}>
        <label>Comment</label>
        <input
          className="border border-black"
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button type="submit" className="border border-black px-1">
          Add comment
        </button>
      </form>
      <p>Comments:</p>
      {blog.comments.length > 0 ? (
        blog.comments.map((comment) => (
          <div key={comment.id} className="mb-2 bg-gray-300 w-fit">
            <p>{comment.user}</p>
            <p>{comment.content}</p>
            <p>{comment.dateCreated}</p>
            {(comment.user == currentUser.username ||
              blog.blogger.username == currentUser.username) && (
              <button
                className="border border-black"
                onClick={() => handleCommentDelete(comment.id)}
              >
                Delete comment
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No comments available</p>
      )}
    </div>
  );
};

export default BlogComments;
