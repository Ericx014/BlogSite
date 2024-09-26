import {useState} from "react";
import BlogServices from "../services/blogs";

const SearchBlogs = ({token, onSearchResults}) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  // const [fromDate, setFromDate] = useState("");
  // const [toDate, setToDate] = useState("");

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
    <form onSubmit={handleSearch} className="mb-4">
      <input
        type="text"
        placeholder="Search for blogs"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded px-2 py-1 mr-2"
      />
      <input
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
      />
      {/* <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="border rounded px-2 py-1 mr-2"
      />
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="border rounded px-2 py-1 mr-2"
      /> */}
      <button
        type="submit"
        className="border border-black px-4 py-1 rounded-sm"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBlogs;
