import { useState, useRef, useEffect } from "react";
import ThreeDotsIcon from "./ThreeDotsIcon";

const DropdownMenu = ({onEdit, onDelete}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ThreeDotsIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-black rounded-xl border border-gray-700 z-50 flex flex-col gap-1">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="transition-all text-left w-[90%] px-4 py-2 mt-2 mx-2 hover:bg-gray-700 rounded-lg text-sm text-white"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="transition-all text-left w-[90%] px-4 py-2 mb-2 mx-2 hover:bg-red-500 hover:text-black rounded-lg text-sm text-red-500"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
