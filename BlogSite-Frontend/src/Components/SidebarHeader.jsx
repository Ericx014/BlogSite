const SidebarHeader = ({username}) => {
  return (
    <div className="px-5 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          <span className="text-lg font-bold text-white">
            {username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Welcome back</span>
          <span className="font-bold tracking-wide text-lg text-white">
            {username}
          </span>
        </div>
      </div>
    </div>
  );
};
export default SidebarHeader;
