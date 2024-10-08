import LogOutButton from "./LogOutButton";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {BlogContext} from "../App";

const SidebarButton = ({text, onClick = () => {console.log(text)}}) => {
  return (
    <button
      onClick={onClick}
      className="text-left pl-5 h-10 rounded-lg hover:bg-white hover:text-black"
    >
      {text}
    </button>
  );
};

const Sidebar = () => {
  const {
    setUsername,
    setToken,
    setAllBlogs,
    setUserBlogs,
    setNotification,
    setNotificationType,
    setIsLoggedIn,
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
    <section className="border border-gray-700 w-[12rem] py-4 px-3 flex flex-col justify-between">
      <div className="flex flex-col gap-1">
        <p className="p-5 font-bold tracking-wider">USERNAME</p>
        <SidebarButton text="Home" />
        <SidebarButton text="Search" />
        <SidebarButton text="My Blogs" />
      </div>
      <LogOutButton handleLogout={handleLogout} />
    </section>
  );
};
export default Sidebar;
