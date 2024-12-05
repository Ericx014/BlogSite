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
        <input
          id="username"
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="focus:outline-none border border-black rounded-full h-10 w-72 px-5 focus:placeholder-transparent"
        />
      </div>
      <div>
        <input
          id="password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="focus:outline-none border border-black rounded-full h-10 w-72 px-5 focus:placeholder-transparent"
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-[#1d9bf0] h-10 w-72 font-semibold tracking-wider text-white hover:bg-black hover:text-white hover:border-white hover:border-[2px]"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
