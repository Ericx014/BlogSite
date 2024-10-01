const BlogsToDisplay = ({blogs, handleBlogSelect}) => {
  return <section className="">
		{blogs.map((blog) => (
			<div
				key={blog.id}
				className="mb-5 cursor-pointer border-b-[1px] border-gray-500 px-8 py-4"
				onClick={() => handleBlogSelect(blog.id)}
			>
				<h4 className="font-bold text-xl tracking-wide">{blog.blogger}</h4>
				<p>{}</p>
				<p>{blog.title}</p>
				<p>{blog.content}</p>
			</div>
		))}
	</section>;
};
export default BlogsToDisplay;
