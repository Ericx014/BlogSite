const DarkInput = ({value, setValue, placeholder}) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={(e) => setValue(e.target.value)}
    className="focus:placeholder-transparent border border-gray-500 bg-black rounded-md h-9 w-72 px-3 py-6"
  />
);

export default DarkInput;