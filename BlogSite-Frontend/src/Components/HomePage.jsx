import {useEffect, useContext, useState, useCallback} from "react";
import {BlogContext} from "../App";
import {useNavigate} from "react-router-dom";
import MainButtons from "./MainButtons";
import BlogForm from "./BlogForm";
import BlogsToDisplay from "./BlogsToDisplay";
import BlogServices from "../services/blogs";

const Blogs = () => {
  const {
    token,
    allBlogs,
    setAllBlogs,
    userBlogs,
    setUserBlogs,
    setCurrentBlogId,
  } = useContext(BlogContext);
  const navigate = useNavigate();
  const [blogsToShow, setBlogToShow] = useState("random");
  const [displayBlogs, setDisplayBlogs] = useState([...allBlogs]);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUserBlogs();
      fetchAllBlogs();
    }
  }, [token]);

  // const addNewBlog = useCallback((newBlog) => {
  //   setAllBlogs((prevBlogs) => [...prevBlogs, newBlog]);
  //   setUserBlogs((prevBlogs) => [...prevBlogs, newBlog]);
  // }, []);

  const handleChooseBlog = (choice) => {
    setBlogToShow(choice);
  };

  const fetchUserBlogs = async () => {
    if (token) {
      try {
        const responseData = await BlogServices.getUserBlogs(token);
        setUserBlogs(responseData);
        console.log(responseData);
      } catch (error) {
        console.error("Failed to fetch user blogs:", error);
      }
    }
  };

  const fetchAllBlogs = async () => {
    if (token) {
      try {
        const responseData = await BlogServices.getAllBlogs(token);
        setAllBlogs(responseData);
      } catch (error) {
        console.error("Failed to fetch all blogs:", error);
      }
    }
  };

  useEffect(() => {
    if (searchResults) {
      setDisplayBlogs(searchResults);
    } else if (blogsToShow === "random") {
      setDisplayBlogs(allBlogs);
    } else if (blogsToShow === "my posts") {
      setDisplayBlogs(userBlogs);
    }
  }, [blogsToShow, allBlogs, userBlogs, searchResults]);

  // const handleSearchResults = (results) => {
  //   setSearchResults(results);
  //   setDisplayBlogs(results);
  // };

  const handleBlogSelect = (blogId) => {
    localStorage.setItem("currentBlogId", JSON.stringify(blogId));
    setCurrentBlogId(blogId);
    navigate("blogpage");
  };

  return (
    <section
      className="w-[40rem] min-h-screen border border-gray-700 flex flex-row"
    >
      <div>
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
							handleChooseBlog={handleChooseBlog}
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
