import {useState} from "react";
import axios from "axios";
import {useNavigate, Link} from "react-router-dom";

const Register = () => {
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // if (!newUsername || newUsername.length < 6) {
    //   console.error(
    //     "Username must be at least 6 characters long and cannot be empty."
    //   );
    //   return;
    // }

    const passwordPattern =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!newPassword || !passwordPattern.test(newPassword)) {
      console.error(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special symbol."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      console.error("Passwords do not match.");
      return;
    }

    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!newEmail || !emailPattern.test(newEmail)) {
      console.error("Invalid email format.");
      return;
    }

    try {
      const response = await axios.post(`https://localhost:44352/users`, {
        username: newUsername,
        email: newEmail,
        password: newPassword,
      });
      setNewUsername("");
      setNewEmail("");
      setNewPassword("");
      console.log("Registered new user:", response.data);
      navigate("/");
			
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <section>
      <h1 className="font-bold uppercase tracking-wider text-xl mb-4">
        Register
      </h1>
      <form onSubmit={handleRegister} className="">
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="border border-black mb-2 rounded-md"
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="border border-black mb-2 rounded-md"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border border-black mb-2 rounded-md"
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-black mb-2 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="border border-black rounded-md px-6 py-1"
        >
          Create Account
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
