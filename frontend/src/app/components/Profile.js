export default function Profile({ onProfileClick }) {
  return (
    <button
      onClick={onProfileClick}
      className="flex justify-center items-center w-7 h-7 md:w-10 md:h-10 rounded-full bg-gray-400 hover:bg-gray-300 transition-colors cursor-pointer"
    >
      T
    </button>
  );
}
