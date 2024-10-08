const LogOutButton = ({handleLogout}) => {
  return (
    <button
      className="border border-black bg-red-600 rounded-lg h-10 w-[100%] transition-all hover:text-red-600 hover:font-semibold hover:bg-red-100"
      onClick={handleLogout}
    >
      Log Out
    </button>
  );
};
export default LogOutButton;
