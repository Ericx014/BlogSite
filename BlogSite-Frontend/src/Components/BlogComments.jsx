import {useState, useRef, useEffect} from "react";
import Divider from "./Divider";
import RoundBlueButton from "./RoundBlueButton";
import CommentForm from "./CommentForm";
import DropdownMenu from "./DropdownMenu";

const BlogComments = ({
  blog,
  handleAddComment,
  commentInput,
  setCommentInput,
  handleCommentDelete,
  handleCommentEdit,
  currentUser,
	formatDate
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
      <CommentForm
        handleAddComment={handleAddComment}
        commentAreaRef={commentAreaRef}
        commentInput={commentInput}
        setCommentInput={setCommentInput}
      />
      {blog.comments.length > 0 &&
        blog.comments.map((comment) => (
          <div key={comment.id} className="mb-2 w-full">
            <div className="flex justify-between px-5 py-3">
              <div>
                <p className="font-bold">@{comment.user}</p>
                {editingCommentId === comment.id ? (
                  <form
                    className="mt-2"
                    onSubmit={() => submitEdit(comment.id)}
                  >
                    <input
                      type="text"
                      value={editCommentContent}
                      onChange={(e) => setEditCommentContent(e.target.value)}
                      className="w-full p-2 border border-gray-600 rounded-md mb-2 focus:outline-none focus:ring-2 bg-black"
                    />
                    <div className="flex flex-row gap-2">
                      <RoundBlueButton text="Save" overwriteClass="w-20 h-8" />
                      <RoundBlueButton
                        text="Cancel"
                        overwriteClass="w-20 bg-red-500"
                        onClick={cancelEditing}
                      />
                    </div>
                  </form>
                ) : (
                  <p>{comment.content}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(comment.dateCreated)}
                </p>
              </div>
              {(comment.user === currentUser?.username ||
                blog.blogger.id === currentUser.id) &&
                !editingCommentId && (
                  <DropdownMenu
                    onEdit={() => startEditing(comment)}
                    onDelete={() => handleCommentDelete(comment.id)}
                    comment={comment}
                  />
                )}
              <button onClick={() => console.log(comment)}>Comment deet</button>
              <button onClick={() => console.log(currentUser)}>Current deet</button>
            </div>
            <Divider />
          </div>
        ))}
    </>
  );
};

export default BlogComments;
