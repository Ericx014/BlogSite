import {useRef, useState, useEffect, useContext} from "react";
import ThreeDotsIcon from "./ThreeDotsIcon";
import {Link} from "react-router-dom";
import {BlogContext} from "../App";

const BlogDropdownMenu = ({handleDelete, startEdit, blog}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {currentUser} = useContext(BlogContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {currentUser.id === blog.blogger.id && (
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            console.log(currentUser);
          }}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ThreeDotsIcon />
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-black rounded-xl border border-gray-700 z-50 flex flex-col gap-1">
          <button
            onClick={() => {
              startEdit;
            }}
            className={`text-left w-[90%] px-4 py-2 mt-2 mx-2 rounded-lg text-sm text-white ${
              currentUser.id !== blog.blogger.id
                ? "cursor-not-allowed"
                : "hover:bg-gray-700"
            }`}
            disabled={currentUser.id !== blog.blogger.id}
          >
            Edit post
          </button>
          <button
            onClick={handleDelete}
            className={`transition-all text-left w-[90%] px-4 py-2 mb-2 mx-2 rounded-lg text-sm text-red-500 ${
              currentUser.id !== blog.blogger.id
                ? "cursor-not-allowed"
                : "hover:bg-red-500 hover:text-black"
            }`}
          >
            Delete post
          </button>
        </div>
      )}
    </div>
  );
};

const BlogInfo = ({blog, startEdit, handleDelete, isEditBlog}) => {
  return (
    <section className="flex flex-row px-5 py-3 justify-between">
      <div>
        <p className="font-bold text-lg">
          <Link to="/blogs/blogger">{blog.blogger.username}</Link>
        </p>
        <p className="opacity-70 leading-3 mb-3">{blog.blogger.email}</p>
        <h1 className="font-bold text-2xl tracking-wide">{blog.title}</h1>
        {isEditBlog ? (
          <p>is editting</p>
        ) : (
          <p className="mb-5 text-justify">{blog.content}</p>
        )}
        <p className="opacity-70">Created on: {blog.dateCreated}</p>
        {blog.dateUpdated && <p>Updated: {blog.dateUpdated}</p>}
      </div>
      <BlogDropdownMenu
        handleDelete={handleDelete}
        startEdit={startEdit}
        blog={blog}
      />
    </section>
  );
};

export default BlogInfo;
