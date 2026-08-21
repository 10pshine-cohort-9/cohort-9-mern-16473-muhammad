const NotebookIllustration = () => (
  <svg viewBox="0 0 400 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="notexGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#d946ef" />
      </linearGradient>
    </defs>

    {/* ambient glow */}
    <circle cx="90" cy="70" r="90" className="fill-violet-500/10" />
    <circle cx="330" cy="190" r="90" className="fill-fuchsia-500/10" />

    {/* notebook page */}
    <rect
      x="90"
      y="30"
      width="220"
      height="180"
      rx="18"
      className="fill-white/[0.06] stroke-white/15"
      strokeWidth="1.5"
    />

    {/* gradient spine on the left edge, like a bound notebook */}
    <path
      d="M 90 48 A 18 18 0 0 1 108 30 L 108 210 A 18 18 0 0 1 90 192 Z"
      fill="url(#notexGrad)"
      opacity="0.85"
    />

    {/* folded page corner */}
    <path d="M 270 30 L 310 30 L 310 70 Z" className="fill-white/10" />
    <path d="M 270 30 L 310 70 L 270 70 Z" className="fill-white/5" />

    {/* note title */}
    <rect x="128" y="55" width="110" height="10" rx="5" className="fill-white/50" />

    {/* body text lines */}
    <rect x="128" y="82" width="150" height="6" rx="3" className="fill-white/15" />
    <rect x="128" y="96" width="130" height="6" rx="3" className="fill-white/15" />
    <rect x="128" y="110" width="140" height="6" rx="3" className="fill-white/15" />

    {/* checklist-style bullets */}
    <circle cx="134" cy="138" r="3" className="fill-fuchsia-400" />
    <rect x="144" y="135" width="90" height="6" rx="3" className="fill-white/15" />
    <circle cx="134" cy="154" r="3" className="fill-violet-400" />
    <rect x="144" y="151" width="110" height="6" rx="3" className="fill-white/15" />
    <circle cx="134" cy="170" r="3" className="fill-fuchsia-400" />
    <rect x="144" y="167" width="70" height="6" rx="3" className="fill-white/15" />

    {/* floating favorite-star badge, overlapping the page corner */}
    <circle cx="318" cy="52" r="26" fill="url(#notexGrad)" />
    <path
      d="M318 38l4.2 9.1 10 .9-7.6 6.7 2.3 9.8-8.9-5.4-8.9 5.4 2.3-9.8-7.6-6.7 10-.9z"
      className="fill-white"
    />

    {/* floating command-palette chip */}
    <rect
      x="46"
      y="176"
      width="86"
      height="30"
      rx="15"
      className="fill-white/10 stroke-white/15"
      strokeWidth="1"
    />
    <text x="89" y="196" textAnchor="middle" className="fill-slate-200 text-[11px] font-semibold">
      Ctrl + K
    </text>
  </svg>
);

export default NotebookIllustration;