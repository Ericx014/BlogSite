const RoundBlueButton = ({text, overwriteClass = "", onClick = () => {}}) => {
  return (
    <button
			type="submit"
      onClick={onClick}
      className={`bg-[#1d9bf0] font-semibold rounded-full ${overwriteClass}`}
    >
      {text}
    </button>
  );
};
export default RoundBlueButton;