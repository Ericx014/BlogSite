import ActiveUnderline from "./ActiveUnderline";

const BlogViewButton = ({handleChooseBlog, blogsToShow, buttonFor}) => {	
	return (
    <button
      className="transition-all border border-none flex-grow hover:bg-gray-700 hover:bg-opacity-50"
      onClick={() => handleChooseBlog(buttonFor)}
    >
      <div className="flex flex-col items-center  justify-center h-full">
        <span
          className={`flex-grow flex items-center capitalize ${
            blogsToShow === buttonFor ? "text-white" : "text-gray-500"
          }`}
        >
          {buttonFor}
        </span>
        {blogsToShow === buttonFor && (
          <ActiveUnderline />
        )}
      </div>
    </button>
  );
};
export default BlogViewButton;
