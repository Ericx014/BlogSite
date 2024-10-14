import {useState, useContext} from "react";
import { BlogContext } from "../App";
import BlogServices from "../services/blogs";
import Sidebar from "./Sidebar";
import RoundBlueButton from "./RoundBlueButton";
import BlogsToDisplay from "./BlogsToDisplay";

const SearchBlogs = () => {
  const [query, setQuery] = useState("");
	// const [searchResults, setSearchResults] = useState(null);
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
	const [foundBlogs, setFoundBlogs] = useState(null);
	const {token} = useContext(BlogContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await BlogServices.searchBlogs(token, {
        query,
        category,
        tag,
      });
      console.log("Search response:", response);
			setQuery("");
			setCategory("");
			setTag("");
      setFoundBlogs(response);
    } catch (error) {
      console.error("Failed to search blogs:", error);
			setFoundBlogs([]);
		}
  };

  return (
    <section className="w-[50rem] border border-gray-700 min-h-screen flex flex-row">
      <Sidebar />
      <div className="ml-[15rem] w-full">
        <form
          onSubmit={handleSearch}
          className="px-6 py-5 border-b border-gray-700 flex flex-col gap-5"
        >
          <div className="flex flex-row w-full">
            <input
							required
              type="text"
              placeholder="Search for blogs"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-black border rounded-full px-4 py-1 mr-2 w-[60%]"
            />
            <RoundBlueButton
              text="Search"
              overwriteClass="px-5 py-[0.3rem] w-[7rem]"
            />
          </div>
          <input
            type="text"
            placeholder="Category (optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="focus:placeholder-transparent border border-gray-500 text-[0.9rem] bg-black rounded-md h-6 w-56 px-3 py-5"
          />
          {/* <input
							type="text"
							placeholder="Tag"
							value={tag}
							onChange={(e) => setTag(e.target.value)}
							className="border rounded px-2 py-1 mr-2"
						/> */}
        </form>
        {foundBlogs === null ? (
          <p className="p-4 text-center text-gray-500">
            Blogs will appear here
          </p>
        ) : foundBlogs.length === 0 ? (
          <p className="p-4 text-center text-gray-500">
            No blogs found. Try a different search term.
          </p>
        ) : (
          <div className="flex flex-col">
            <div className="w-full flex flex-row items-center justify-between">
              <BlogsToDisplay blogs={foundBlogs} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchBlogs;
