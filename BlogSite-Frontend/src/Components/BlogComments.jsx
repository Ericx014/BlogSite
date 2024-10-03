import {useState, useRef, useEffect} from "react";
import Divider from "./Divider";
import AutoTextArea from "./AutoTextArea";
import RoundBlueButton from "./RoundBlueButton";

const BlogComments = ({
  blog,
  handleAddComment,
  commentInput,
  setCommentInput,
  handleCommentDelete,
  handleCommentEdit,
  currentUser,
}) => {
  const commentAreaRef = useRef(null);

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

  useEffect(() => {
    if (commentAreaRef.current) {
      commentAreaRef.current.style.height = "auto";
      commentAreaRef.current.style.height = `${commentAreaRef.current.scrollHeight}px`;
    }
  }, [commentInput]);

  return (
    <>
      <form onSubmit={handleAddComment} className="flex flex-row items-center justify-between px-3 pb-5"> 
        <AutoTextArea
          overwriteClass={"pt-3 px-4 text-md w-[65%] h-3"}
          ref={commentAreaRef}
          placeholder="Add a comment"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <RoundBlueButton text="Add Comment" overwriteClass="w-40 h-10" />
      </form>
      <Divider />
      {blog.comments.length > 0 &&
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
                  className="border border-black px-1 text-white"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="border border-black px-1 text-white"
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
        ))}
    </>
  );
};

export default BlogComments;
