import {useState, useRef, useEffect} from "react";
import Divider from "./Divider";
import AutoTextArea from "./AutoTextArea";
import RoundBlueButton from "./RoundBlueButton";
import ThreeDotsIcon from "./ThreeDotsIcon";

const CommentDropdownMenu = ({onEdit, onDelete}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ThreeDotsIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-black rounded-xl border border-gray-700 z-50">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm text-white"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm text-red-500"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

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
      <form
        onSubmit={handleAddComment}
        className="flex flex-row items-center justify-between px-3 pb-5"
      >
        <AutoTextArea
          overwriteClass="pt-3 px-4 text-md w-[65%] h-3"
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
          <div key={comment.id} className="mb-2 w-full">
            <div className="py-3 px-5 relative">
              <div className="flex justify-between items-start">
                <div className="flex-1">
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
                        <RoundBlueButton
                          text="Save"
                          overwriteClass="w-20 h-8"
                        />
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
                    {comment.dateCreated}
                  </p>
                </div>
                {comment.user === currentUser?.username &&
                  !editingCommentId && (
                    <DropdownMenu
                      onEdit={() => startEditing(comment)}
                      onDelete={() => handleCommentDelete(comment.id)}
                    />
                  )}
              </div>
            </div>
            <Divider />
          </div>
        ))}
    </>
  );
};

export default BlogComments;
