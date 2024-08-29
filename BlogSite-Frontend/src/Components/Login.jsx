import {useNavigate, Link} from "react-router-dom";
import {useContext} from "react";
import {BlogContext} from "../App";
import axios from "axios";

const Login = () => {
  const {username, password, setUsername, setPassword, setToken} =
    useContext(BlogContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:44352/login", {
        username,
        password,
      });
      console.log("Token:", response.data.token);
      setToken(response.data.token);
      setPassword("");
      navigate("/blogs");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const loginForm = (
    <form onSubmit={handleLogin} className="">
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-black mb-2 rounded-md"
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-black mb-2 rounded-md"
        />
      </div>
      <button
        type="submit"
        className="border border-black rounded-md px-6 py-1"
      >
        Login
      </button>
    </form>
  );

  return (
    <section>
      <h1 className="font-bold uppercase tracking-wider text-xl mb-4">
        Log in
      </h1>
      {loginForm}
      <p>
        Dont have an account?{" "}
        <Link to="/register">
          <button className="font-semibold hover:underline transition-all">
            Create one.
          </button>
        </Link>
      </p>
    </section>
  );
};

export default Login;
