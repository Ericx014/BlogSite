import {useContext, useState} from "react";
import {BlogContext} from "../App";
import {useNavigate} from "react-router-dom";
import MainButtons from "./MainButtons";
import BlogForm from "./BlogForm";
import BlogsToDisplay from "./BlogsToDisplay";
import Sidebar from "./Sidebar";

const Blogs = ({}) => {
  const {setCurrentBlogId, blogsToShow, displayBlogs, setBlogToShow} =
    useContext(BlogContext);
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState(null);

  const handleBlogSelect = (blogId) => {
    localStorage.setItem("currentBlogId", JSON.stringify(blogId));
    setCurrentBlogId(blogId);
    navigate("blogpage");
  };

  return (
    <section className="w-[50rem] min-h-screen border border-gray-700 flex flex-row">
      <Sidebar setBlogToShow={setBlogToShow} />
      <div className="ml-[15rem] w-full">
        {/* <h1 className="font-bold text-lg mb-4">
					Username: {currentUser.username}
				</h1>
				<SearchBlogs token={token} onSearchResults={handleSearchResults} /> */}
        {searchResults ? (
          <div className="flex flex-row">
            <h2 className="font-bold">Search results</h2>
            <button
              className="bg-white border border-black px-2"
              onClick={() => setSearchResults(null)}
            >
              Back
            </button>
          </div>
        ) : (
          <>
            <MainButtons
              setBlogToShow={setBlogToShow}
              blogsToShow={blogsToShow}
            />
            <BlogForm />
          </>
        )}
        <BlogsToDisplay
          blogs={displayBlogs}
          handleBlogSelect={handleBlogSelect}
        />
      </div>
    </section>
  );
};

export default Blogs;
