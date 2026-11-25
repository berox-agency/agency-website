const icons = {
  web: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18" />
      <path d="M7 6.5h.01" />
      <path d="M10 6.5h.01" />
    </>
  ),
  mobile: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </>
  ),
  design: (
    <>
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </>
  ),
  saas: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </>
  ),
  ai: (
    <>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 15l.9 2.1 2.1.9-2.1.9L19 21l-.9-2.1-2.1-.9 2.1-.9L19 15z" />
    </>
  ),
  support: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M5.6 5.6l3.9 3.9" />
      <path d="M14.5 14.5l3.9 3.9" />
      <path d="M18.4 5.6l-3.9 3.9" />
      <path d="M9.5 14.5l-3.9 3.9" />
    </>
  ),
};

export const serviceKeys = ["web", "mobile", "design", "saas", "ai", "support"];

export function ServiceIcon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {icons[name]}
    </svg>
  );
}

function Arrow({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={
        "col-start-1 row-start-1 h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] " +
        className
      }
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ArrowBadge({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={
        "relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-surface text-primary transition-colors duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-onprimary " +
        className
      }
    >
      <span className="grid place-items-center rtl:-scale-x-100">
        <Arrow className="group-hover:translate-y-[-220%] group-hover:translate-x-[220%]" />
        <Arrow className="translate-x-[-220%] translate-y-[220%] group-hover:translate-x-0 group-hover:translate-y-0" />
      </span>
    </span>
  );
}
