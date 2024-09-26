import {useState} from "react";

const BlogComments = ({
  blog,
  handleAddComment,
  commentInput,
  setCommentInput,
  handleCommentDelete,
  handleCommentEdit,
  currentUser,
}) => {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  const submitEdit = (commentId) => {
    handleCommentEdit(commentId, editCommentContent);
    setEditingCommentId(null);
    setEditCommentContent("");
  };

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
            {editingCommentId === comment.id ? (
              <div>
                <input
                  type="text"
                  value={editCommentContent}
                  onChange={(e) => setEditCommentContent(e.target.value)}
                  className="border border-black"
                />
                <button
                  onClick={() => submitEdit(comment.id)}
                  className="border border-black px-1"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="border border-black px-1"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p>{comment.content}</p>
            )}
            <p>{comment.dateCreated}</p>
            {comment.user === currentUser.username && (
              <>
                <button
                  className="border border-black px-1"
                  onClick={() => startEditing(comment)}
                >
                  Edit
                </button>
                <button
                  className="border border-black px-1"
                  onClick={() => handleCommentDelete(comment.id)}
                >
                  Delete
                </button>
              </>
            )}
            {blog.blogger.username === currentUser.username &&
              comment.user !== currentUser.username && (
                <button
                  className="border border-black px-1"
                  onClick={() => handleCommentDelete(comment.id)}
                >
                  Delete
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
