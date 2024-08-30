import {useNavigate, Link} from "react-router-dom";
import {useContext, useEffect} from "react";
import {BlogContext} from "../App";
import authService from "../services/login";
import LoginForm from "./LoginForm";
import Notification from "./Notification";

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
  } = useContext(BlogContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => {
        setNotification("");
        setNotificationType("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification, notificationType, setNotification, setNotificationType]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const responseData = await authService.login(username, password);
      loginSuccess(responseData);
    } catch (error) {
      loginFail(error);
    }
  };
  const loginSuccess = (responseData) => {
    setToken(responseData.token);
    setPassword("");
    navigate("/blogs");
  };
  const loginFail = (error) => {
    setNotification("Wrong username or password");
    setNotificationType("error");
    console.error("Login failed:", error);
  };

	const registrationLink = (
    <>
      <p>
        Dont have an account?{" "}
        <Link to="/register">
          <button className="font-semibold hover:underline transition-all">
            Create one.
          </button>
        </Link>
      </p>
    </>
  );

  return (
    <section>
      <Notification />
      <h1 className="font-bold uppercase tracking-wider text-xl mb-4">
        Log in
      </h1>
      <LoginForm
        handleLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />
      {registrationLink}
    </section>
  );
};

export default Login;
