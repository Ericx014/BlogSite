import BlogViewButton from "./BlogViewButton";

const MainButtons = ({handleChooseBlog, blogsToShow}) => {
	return (
    <section className="h-14 flex flex-row w-full font-bold bg-black border-b-[1px] border-gray-700">
      <BlogViewButton
        handleChooseBlog={handleChooseBlog}
        blogsToShow={blogsToShow}
        buttonFor="random"
      />
      <BlogViewButton
        handleChooseBlog={handleChooseBlog}
        blogsToShow={blogsToShow}
        buttonFor="my posts"
      />
    </section>
  );
}
export default MainButtons;