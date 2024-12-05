import {useRootContext} from "../App";

const Notification = () => {
  const {notification, notificationType} = useRootContext();

  if (!notification) return null;

  const bgColor = notificationType === "error" ? "bg-red-600" : "bg-green-600";

  return (
    <div
      className={`${bgColor}  fixed top-4 left-1/2 transform -translate-x-1/2
			text-white px-4 py-2 rounded-md z-50 text-center`}
    >
      {notification}
    </div>
  );
};

export default Notification;
