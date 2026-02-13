export const NoCoin = ({ className }: { className?: string } = {}) => (
  <svg
    className={className}
    width="256"
    height="256"
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#101827" />
        <stop offset="100%" stopColor="#1f2937" />
      </linearGradient>
    </defs>
    <circle cx="128" cy="128" r="120" fill="url(#bg)" />

    <circle
      cx="128"
      cy="128"
      r="112"
      fill="none"
      stroke="#4b5563"
      strokeWidth="6"
      strokeDasharray="8 6"
    />

    <path
      d="M104 88c4-18 18-28 36-28 20 0 36 13 36 34 0 18-11 28-24 34-10 5-14 9-14 20v8"
      fill="none"
      stroke="#9ca3af"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="132" cy="188" r="8" fill="#9ca3af" />

    <line
      x1="48"
      y1="128"
      x2="72"
      y2="128"
      stroke="#374151"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <line
      x1="184"
      y1="128"
      x2="208"
      y2="128"
      stroke="#374151"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <line
      x1="128"
      y1="48"
      x2="128"
      y2="72"
      stroke="#374151"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <line
      x1="128"
      y1="184"
      x2="128"
      y2="208"
      stroke="#374151"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);
