import LogOutButton from "./LogOutButton";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {BlogContext} from "../App";
import SidebarHeader from "./SidebarHeader";

const SidebarButton = ({
  text,
  onClick = () => {
    console.log(text);
  },
}) => {
  return (
    <button
      onClick={onClick}
      className="transition-all text-left pl-5 h-10 rounded-lg hover:bg-white hover:text-black"
    >
      {text}
    </button>
  );
};

const Sidebar = ({setBlogToShow}) => {
  const {
    setUsername,
    setToken,
    setAllBlogs,
    setUserBlogs,
    setNotification,
    setNotificationType,
    setIsLoggedIn,
    currentUser,
  } = useContext(BlogContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken("");
    setUserBlogs([]);
    setAllBlogs([]);
    setUsername("");
    setNotification("Logged out successfully");
    setNotificationType("success");
    setIsLoggedIn(false);

    localStorage.removeItem("logInStatus");
    localStorage.removeItem("blogUser");
    localStorage.removeItem("blogsiteToken");
    localStorage.removeItem("currentBlogId");

    navigate("/");
  };

  return (
    <section className="fixed border border-gray-700 w-[15rem] h-screen py-6 px-3 flex flex-col justify-between bg-black">
      <div className="flex flex-col gap-1">
        <SidebarHeader username={currentUser.username} />

        <SidebarButton
          text="Home"
          onClick={() => {
            navigate("/blogs");
            setBlogToShow("explore");
          }}
        />
        <SidebarButton
          text="Search"
          onClick={() => {
            navigate("search");
          }}
        />
        <SidebarButton
          text="My Blogs"
          onClick={() => {
            navigate("/blogs");
            setBlogToShow("my posts");
          }}
        />
      </div>
      <LogOutButton handleLogout={handleLogout} />
    </section>
  );
};
export default Sidebar;
