const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  return (
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
};

export default LoginForm;
