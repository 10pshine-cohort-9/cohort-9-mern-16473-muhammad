const EmptyNotesIllustration = () => (
  <svg viewBox="0 0 320 260" className="w-48 h-48 mx-auto" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="emptyGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#d946ef" />
      </linearGradient>
    </defs>

    <g transform="translate(60, 30)">
      {/* back page, slightly rotated and offset for depth */}
      <rect
        x="-10"
        y="10"
        width="150"
        height="190"
        rx="14"
        transform="rotate(-8 65 105)"
        className="fill-white/[0.05] stroke-white/10"
        strokeWidth="1.5"
      />

      {/* front page */}
      <rect
        x="10"
        y="0"
        width="150"
        height="200"
        rx="16"
        className="fill-white/[0.08] stroke-white/15"
        strokeWidth="1.5"
      />

      {/* icon block top-left */}
      <rect x="28" y="24" width="30" height="30" rx="8" fill="url(#emptyGrad)" />

      {/* title lines next to icon */}
      <rect x="66" y="30" width="70" height="8" rx="4" className="fill-white/30" />
      <rect x="66" y="44" width="50" height="8" rx="4" className="fill-white/15" />

      {/* body text lines */}
      <rect x="28" y="76" width="120" height="7" rx="3.5" className="fill-white/15" />
      <rect x="28" y="92" width="100" height="7" rx="3.5" className="fill-white/15" />
      <rect x="28" y="108" width="110" height="7" rx="3.5" className="fill-white/15" />
      <rect x="28" y="124" width="80" height="7" rx="3.5" className="fill-white/15" />

      {/* floating plus badge, overlapping the front page corner */}
      <circle cx="150" cy="190" r="26" fill="url(#emptyGrad)" />
      <path
        d="M150 178v24M138 190h24"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export default EmptyNotesIllustration;