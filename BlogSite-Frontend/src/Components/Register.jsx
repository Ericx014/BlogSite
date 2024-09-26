import {useState, useContext} from "react";
import {useNavigate, Link} from "react-router-dom";
import {BlogContext} from "../App";
import UserServices from "../services/users";

const Register = () => {
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {setNotification, setNotificationType} = useContext(BlogContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    validateUsername(newUsername);
    validatePassword(newPassword, confirmPassword);
    validateEmail(newEmail);

    try {
      await UserServices.addUser(newUsername, newEmail, newPassword);
      registrationSuccess();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const validateUsername = (username) => {
    if (!username || username.length < 6) {
      console.error(
        "Username must be at least 6 characters long and cannot be empty."
      );
      return;
    }
  };
  const validatePassword = (password, repeatPassword) => {
    const passwordPattern =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#.?!@$%^&*-]).{8,}$/;
    if (!password || !passwordPattern.test(password)) {
      console.error(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special symbol."
      );
      return;
    }
    if (password !== repeatPassword) {
      console.error("Passwords do not match.");
      return;
    }
  };
  const validateEmail = (email) => {
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!email || !emailPattern.test(email)) {
      console.error("Invalid email format.");
      return;
    }
  };

  const registrationSuccess = () => {
    setNewUsername("");
    setNewEmail("");
    setNewPassword("");
    setNotification("Account created. Please log in.");
    setNotificationType("success");
    navigate("/");
  };

  return (
    <section className="text-black flex flex-col items-center">
      <h2 className="font-bold text-[2rem] mb-4 text-white">
        Create an account
      </h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-3 text-white">
        <input
          type="text"
          placeholder="Username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="border border-gray-500 bg-black rounded-md h-9 w-72 px-3 py-6"
        />
        <input
          type="text"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="border border-gray-500  bg-black rounded-md h-9 w-72 px-3 py-6"
        />
        <input
          type="password"
          placeholder="Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border border-gray-500 bg-black rounded-md h-9 w-72 px-3 py-6"
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border border-gray-500 bg-black rounded-md h-9 w-72 px-3 py-6"
        />
        <button
          type="submit"
          className="font-semibold text-[#1d9bf0] text-black tracking-wide hover:underline rounded-full bg-white w-72 py-1 mt-4"
        >
          Sign up
        </button>
      </form>
      <p>
        Already have an account?{" "}
        <Link to="/">
          <button className="font-semibold hover:underline transition-all">
            Log in.
          </button>
        </Link>
      </p>
    </section>
  );
};

export default Register;
