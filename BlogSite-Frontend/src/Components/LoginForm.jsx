const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-2 text-black">
      <div>
        {/* <label htmlFor="username" className="block">
          Username:
        </label> */}
        <input
          id="username"
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-black rounded-full h-10 w-72 px-5"
        />
      </div>
      <div>
        {/* <label htmlFor="password" className="block">
          Password:
        </label> */}
        <input
          id="password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-black rounded-full h-10 w-72 px-5"
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-[#1d9bf0] h-10 w-72 font-semibold tracking-wider text-white"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
