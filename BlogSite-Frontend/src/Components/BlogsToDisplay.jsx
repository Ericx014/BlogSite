const BlogsToDisplay = ({blogs, handleBlogSelect}) => {
  return (
    <section className="">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="mb-5 cursor-pointer border-b-[1px] border-gray-700 px-8 py-4"
          onClick={() => handleBlogSelect(blog.id)}
        >
          <div className="flex flex-col leading-3 mb-3">
						<h4 className="font-bold text-xl tracking-wide">{blog.blogger}</h4>
						<p className="text-gray-500">{blog.bloggerEmail}</p>
					</div>
          <p>{blog.title}</p>
          <p>{blog.content}</p>
        </div>
      ))}
    </section>
  );
};
export default BlogsToDisplay;
