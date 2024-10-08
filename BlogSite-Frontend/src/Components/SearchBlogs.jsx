import {useState} from "react";
import BlogServices from "../services/blogs";
import Sidebar from "./Sidebar";
import RoundBlueButton from "./RoundBlueButton";

const SearchBlogs = ({token, onSearchResults}) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await BlogServices.searchBlogs(token, {
        query,
        category,
        tag,
      });
      console.log("Search response:", response);
      onSearchResults(response);
    } catch (error) {
      console.error("Failed to search blogs:", error);
    }
  };

  return (
    <section className="w-[50rem] border border-gray-700 min-h-screen flex flex-row">
      <Sidebar />
      <div className="ml-[15rem] w-full">
        <form onSubmit={handleSearch} className="px-6 py-5 items-center flex justify-start border-b border-gray-700">
          <input
            type="text"
            placeholder="Search for blogs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded-full px-4 py-1 mr-2 w-[60%]"
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
          <RoundBlueButton text="Search" overwriteClass="px-5 py-[0.3rem] w-[7rem]" />
        </form>
      </div>
    </section>
  );
};

export default SearchBlogs;
