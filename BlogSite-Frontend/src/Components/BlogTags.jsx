const BlogTags = ({blog}) => {
	return (
    <div className="mt-6">
      <p>Tags:</p>
      {blog.tags.length > 0 ? (
        blog.tags.map((tag, index) => <p key={index}>{tag}</p>)
      ) : (
        <p>No tags available</p>
      )}
    </div>
  );
}	

export default BlogTags;