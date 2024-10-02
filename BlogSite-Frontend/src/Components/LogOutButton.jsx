const LogOutButton = ({handleLogout}) => {
  return (
    <button
      className="border border-black bg-red-600 rounded-lg h-10 w-28 ml-8 my-8"
      onClick={handleLogout}
    >
      Log Out
    </button>
  );
};
export default LogOutButton;