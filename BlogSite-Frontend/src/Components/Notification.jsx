import { useContext } from "react";
import { BlogContext } from "../App";

const Notification = () => {
	const {notification, notificationType} = useContext(BlogContext);

	return (
    <>
      {notification && (
        <p className={`border border-black p-2 mb-4 rounded-md text-black`}>
          {notification}
        </p>
      )}
    </>
  );
}

export default Notification;