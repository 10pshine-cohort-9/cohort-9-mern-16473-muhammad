const StarIcon = ({ filled, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    className={`${className} ${filled ? 'fill-amber-400 stroke-amber-400' : 'fill-none stroke-slate-500'}`}
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 2.5l2.9 6.28 6.93.6-5.24 4.6 1.58 6.77L12 17.03l-6.17 3.72 1.58-6.77-5.24-4.6 6.93-.6L12 2.5z"
    />
  </svg>
);

export default StarIcon;