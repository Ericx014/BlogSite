const Tag = ({blog, handleRemoveTag, isAddTag, setIsAddTag}) => {
  return (
    <>
      <div className="flex flex-row gap-2">
        {blog.tags && blog.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 rounded-full px-3 py-1"
              >
                <span className="text-black">{tag}</span>
                <button
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveTag(tag)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No tags available</p>
        )}
        {!isAddTag && (
          <button
            className="flex items-center text-black bg-gray-100 rounded-full px-3 py-1"
            onClick={() => setIsAddTag(!isAddTag)}
          >
            +
          </button>
        )}
      </div>
    </>
  );
};
export default Tag;
