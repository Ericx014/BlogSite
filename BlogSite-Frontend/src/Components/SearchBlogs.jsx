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
	const [foundBlogs, setFoundBlogs] = useState([]);
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
    }
  };

  return (
    <section className="w-[50rem] border border-gray-700 min-h-screen flex flex-row">
      <Sidebar />
      <div className="ml-[15rem] w-full">
        <form
          onSubmit={handleSearch}
          className="px-6 py-5 items-center flex justify-start border-b border-gray-700"
        >
          <input
            type="text"
            placeholder="Search for blogs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-black border rounded-full px-4 py-1 mr-2 w-[60%]"
          />
          {/* <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          />
          <input
            type="text"
            placeholder="Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          /> */}
          <RoundBlueButton
            text="Search"
            overwriteClass="px-5 py-[0.3rem] w-[7rem]"
          />
        </form>
        {/* <h1 className="font-bold text-lg mb-4">
					Username: {currentUser.username}
				</h1>
				<SearchBlogs token={token} onSearchResults={handleSearchResults} /> */}
        {foundBlogs ? (
          <div className="flex flex-col">
            <div className="w-full flex flex-row items-center justify-between">
							<h2 className="font-bold">Search results</h2>
							<button
								className="bg-black border border-black px-2"
								// onClick={() => setSearchResults(null)}
							>
								Back
							</button>
						</div>
						<div>
							<BlogsToDisplay blogs={foundBlogs} handleBlogSelect={() => {console.log("Hi")}} />
							<button className="bg-white text-black" onClick={() => console.log(foundBlogs)}>Found blogs deets</button>
						</div> 
          </div>
        ) : (
          <>
            <div>Hi</div>
          </>
        )}
      </div>
    </section>
  );
};

export default SearchBlogs;
