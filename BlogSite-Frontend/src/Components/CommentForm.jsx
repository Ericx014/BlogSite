import AutoTextArea from "./AutoTextArea";
import RoundBlueButton from "./RoundBlueButton";
import Divider from "./Divider";

const CommentForm = ({
  handleAddComment,
  commentAreaRef,
  commentInput,
  setCommentInput,
}) => (
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
      <RoundBlueButton text="Post Comment" overwriteClass="w-48 h-10 mr-5" />
    </form>
    <Divider />
  </>
);
export default CommentForm;