import BlogViewButton from "./BlogViewButton";

const MainButtons = ({setBlogToShow, blogsToShow}) => {
  return (
    <section className="h-14 flex flex-row w-full font-bold bg-black border-b-[1px] border-gray-700">
      <BlogViewButton
        setBlogToShow={setBlogToShow}
        blogsToShow={blogsToShow}
        buttonFor="explore"
      />
      <BlogViewButton
        setBlogToShow={setBlogToShow}
        blogsToShow={blogsToShow}
        buttonFor="my posts"
      />
    </section>
  );
};
export default MainButtons;