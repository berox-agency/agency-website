function ArrowIcon({ className }) {
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
        "col-start-1 row-start-1 h-4.5 w-4.5 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] " +
        className
      }
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export default function SecondaryButton({
  href,
  children,
  className = "",
  onClick,
  ...rest
}) {
  const classes =
    "group relative inline-flex [--btn-h:clamp(2.75rem,7svh,3.25rem)] h-(--btn-h) w-max shrink-0 cursor-pointer items-center justify-center gap-4 self-center whitespace-nowrap rounded-full border border-line bg-surface/50 p-1 ps-6 text-[0.9375rem] font-semibold text-content backdrop-blur-md transition-[border-color,box-shadow,background-color,transform] duration-500 hover:border-primary/60 hover:bg-surface hover:shadow-[0_10px_40px_-14px_var(--primary)] focus-visible:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.97] sm:text-sm " +
    className;

  return (
    <a href={href} onClick={onClick} className={classes} {...rest}>
      <span className="whitespace-nowrap transition-colors duration-300 group-hover:text-primary group-focus-visible:text-primary">
        {children}
      </span>
      <span className="relative grid h-[calc(var(--btn-h)_-_0.5rem_-_2px)] w-[calc(var(--btn-h)_-_0.5rem_-_2px)] shrink-0 place-items-center overflow-hidden rounded-full bg-primary/15 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-onprimary group-focus-visible:bg-primary group-focus-visible:text-onprimary">
        <span className="grid place-items-center rtl:-scale-x-100">
          <ArrowIcon className="group-hover:-translate-y-[220%] group-hover:translate-x-[220%] group-focus-visible:-translate-y-[220%] group-focus-visible:translate-x-[220%]" />
          <ArrowIcon className="-translate-x-[220%] translate-y-[220%] group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0" />
        </span>
      </span>
    </a>
  );
}
