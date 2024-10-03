import {forwardRef} from "react";

const AutoTextArea = forwardRef(
  ({overwriteClass = "", placeholder, value, onChange}, ref) => {
    return (
      <textarea
        required
        ref={ref}
        className={`focus:outline-none bg-transparent resize-none text-xl w-full ${overwriteClass}`}
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={onChange}
      />
    );
  }
);

AutoTextArea.displayName = "AutoTextArea";

export default AutoTextArea;
