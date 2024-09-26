import {useNavigate} from "react-router-dom";
import {useState, useContext, useEffect} from "react";
import {BlogContext} from "../App";
import AuthServices from "../services/login";
import UserServices from "../services/users";
import LoginForm from "./LoginForm";
import Notification from "./Notification";
import Register from "./Register";

const Login = () => {
  const {
    username,
    password,
    setUsername,
    setPassword,
    setToken,
    notification,
    setNotification,
    notificationType,
    setNotificationType,
    setCurrentUser,
    isLoggedIn,
    setIsLoggedIn,
  } = useContext(BlogContext);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => {
        setNotification("");
        setNotificationType("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification, notificationType, setNotification, setNotificationType]);

  useEffect(() => {
    const logOutTimer = setTimeout(() => {
      localStorage.removeItem("logInStatus");
      setIsLoggedIn(false);
      navigate("/");
    }, 360000);

    return () => clearTimeout(logOutTimer);
  }, [isLoggedIn, setIsLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const responseData = await AuthServices.login(username, password);
      console.log(responseData);
      loginSuccess(responseData, username);
    } catch (error) {
      loginFail(error);
    }
  };
  const loginSuccess = async (responseData, loggedInUsername) => {
    localStorage.setItem("blogsiteToken", JSON.stringify(responseData.token));
    setToken(responseData.token);

    setPassword("");
    const loggedInUser = await UserServices.getUserByUsername(loggedInUsername);
    console.log(loggedInUser);

    localStorage.setItem("blogUser", JSON.stringify(loggedInUser));
    setCurrentUser(loggedInUser);

    localStorage.setItem("logInStatus", JSON.stringify(true));
    setIsLoggedIn(true);

    navigate("/blogs");
  };
  const loginFail = (error) => {
    setNotification("Wrong username or password");
    setNotificationType("error");

    console.error("Login failed:", error);
  };

  const or = (
    <div className="flex items-center justify-center my-4 w-72">
      <div className="border-t border-gray-500 flex-grow"></div>
      <span className="mx-2 text-white">or</span>
      <div className="border-t border-gray-500 flex-grow"></div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col justify-center">
      <section className="px-10">
        <Notification />
        <h1 className="font-bold capitalize tracking-wide leading-[5rem] text-[5rem] mb-4">
          Happening now
        </h1>
        <h2 className="font-bold text-[2.2rem] mb-6">Start exploring.</h2>
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
        {or}
        <div className="flex flex-col gap-2">
					<button
						onClick={openModal}
						className="font-semibold text-[#1d9bf0] tracking-wide rounded-full border border-white h-10 w-72"
					>
						Create an account
					</button>
					<p className="text-[0.8rem] w-72 leading-4 tracking-tight">
						By signing up, you agree to the{" "}
						<span className="text-[#1d9bf0]">Terms of Service</span> and{" "}
						<span className="text-[#1d9bf0]">Privacy Policy</span>, including{" "}
						<span className="text-[#1d9bf0]">Cookie Use</span>.
					</p>
				</div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-black p-6 rounded-lg max-w-lg w-full">
            <button className="text-right text-white" onClick={closeModal}>
              ×
            </button>{" "}
            {/* Close modal button */}
            <Register /> {/* Render Register component */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
