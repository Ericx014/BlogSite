const RoundBlueButton = ({text, overwriteClass = "", onClick = () => {}}) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className={`bg-[#1d9bf0] font-semibold rounded-full transition-al border border-[#1d9bf0] hover:text-[#1d9bf0] hover:bg-blue-100 hover:border-[#1d9bf0] ${overwriteClass}`}
    >
      {text}
    </button>
  );
};
export default RoundBlueButton;
