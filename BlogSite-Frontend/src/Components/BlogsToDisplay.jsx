const BlogsToDisplay = ({blogs, handleBlogSelect}) => {
  return (
    <section className="">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="cursor-pointer border-b-[1px] border-gray-700 px-6 py-4"
          onClick={() => handleBlogSelect(blog.id)}
        >
          <div className="flex flex-col mb-2">
            <h4 className="font-bold text-xl tracking-wide leading-5">
              {blog.blogger}
            </h4>
            <p className="opacity-50 text-sm">{blog.bloggerEmail}</p>
          </div>
          <p className="text-xl mb-1 font-semibold">{blog.title}</p>
          <p>{blog.content}</p>
        </div>
      ))}
    </section>
  );
};
export default BlogsToDisplay;
