export function BrowserFrame({ url, children, className = "" }) {
  return (
    <div
      className={
        "overflow-hidden rounded-xl border border-line bg-surface shadow-2xl shadow-black/25 " +
        className
      }
    >
      <div className="flex items-center gap-3 border-b border-line bg-canvas px-3 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-line"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-line"></span>
        </span>
        {url ? (
          <span
            dir="ltr"
            className="min-w-0 flex-1 truncate rounded-md bg-surface px-3 py-1 text-center text-[11px] text-muted"
          >
            {url}
          </span>
        ) : null}
      </div>
      <div className="relative aspect-[16/10] bg-canvas">{children}</div>
    </div>
  );
}

export function PhoneFrame({ children, className = "" }) {
  return (
    <div
      className={
        "overflow-hidden rounded-[1.6rem] border-[5px] border-line bg-canvas shadow-2xl shadow-black/40 " +
        className
      }
    >
      <div className="relative aspect-[9/19]">{children}</div>
    </div>
  );
}

export function ArrowIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={"h-4 w-4 rtl:-scale-x-100 " + className}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ExternalIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={"h-4 w-4 " + className}
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
