import {useRef, useState, useEffect, useContext} from "react";
import ThreeDotsIcon from "./ThreeDotsIcon";
import {Link} from "react-router-dom";
import {BlogContext} from "../App";
import RoundBlueButton from "./RoundBlueButton";
import AutoTextArea from "./AutoTextArea";

const BlogDropdownMenu = ({handleDelete, startEditing, blog}) => {
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
            onClick={() => startEditing(blog)}
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

const BlogInfo = ({blog, handleDelete, handleEditBlog, formatDate}) => {
  const [editBlogId, setEditBlogId] = useState(null);
  const [editBlogContent, setEditBlogContent] = useState("");

  const blogTextareaRef = useRef(null);

  useEffect(() => {
    if (blogTextareaRef.current) {
      blogTextareaRef.current.style.height = "auto";
      blogTextareaRef.current.style.height = `${blogTextareaRef.current.scrollHeight}px`;
    }
  }, [editBlogContent]);

  const startEditing = (blog) => {
    setEditBlogId(blog.id);
    setEditBlogContent(blog.content);
  };

  const cancelEditing = () => {
    setEditBlogId(null);
    setEditBlogContent("");
  };

  return (
    <section className="flex flex-row px-5 py-3 justify-between w-full">
      <div>
        <p className="font-bold text-lg">
          <Link to="/blogs/blogger">{blog.blogger.username}</Link>
        </p>
        <p className="opacity-70 leading-3 mb-3">{blog.blogger.email}</p>
        <h1 className="font-bold text-2xl tracking-wide">{blog.title}</h1>
        {editBlogId === blog.id ? (
          <form className="w-full">
            <AutoTextArea
              required
              ref={blogTextareaRef}
              overwriteClass="text-md text-justify w-[35rem]"
              value={editBlogContent}
              onChange={(e) => setEditBlogContent(e.target.value)}
            />
            <div className="flex flex-row gap-2 my-3">
              <RoundBlueButton
                onClick={(e) => {
                  handleEditBlog(e, editBlogContent);
                  setEditBlogId(null);
                }}
                text="Save"
                overwriteClass="w-20 h-8"
              />
              <RoundBlueButton
                onClick={cancelEditing}
                text="Cancel"
                overwriteClass="w-20 h-8 bg-red-500"
              />
            </div>
          </form>
        ) : (
          <p className="mb-5 text-justify text-md w-[35rem]">{blog.content}</p>
        )}
        <p className="opacity-70">Created on: {formatDate(blog.dateCreated)}</p>
        {blog.dateUpdated && (
          <p className="opacity-70">Updated: {formatDate(blog.dateUpdated)}</p>
        )}
      </div>
      <BlogDropdownMenu
        handleDelete={handleDelete}
        startEditing={startEditing}
        blog={blog}
      />
    </section>
  );
};

export default BlogInfo;
