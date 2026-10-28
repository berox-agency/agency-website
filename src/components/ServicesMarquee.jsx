// Each half of the track repeats the list this many times, so one half is
// always wider than the screen (needed for a seamless loop on big monitors).
const REPEAT = 3;

function Star() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0 text-primary md:h-4 md:w-4"
    >
      <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
    </svg>
  );
}

/*
  Infinite, seamless scroll bar of text items. Pure CSS animation (see
  .marquee-* in globals.css): it flips direction in RTL, pauses on hover and
  becomes a plain scrollable row when the visitor prefers reduced motion.

  Props
    items          array of strings
    label          accessible name for the bar (e.g. "Our services")
    secondsPerItem scroll speed: lower = faster (default 3.4)
    className      extra classes for the outer element
*/
export default function ServicesMarquee({
  items,
  label,
  secondsPerItem = 3.4,
  className = "",
}) {
  if (!items || items.length === 0) {
    return null;
  }

  const duration = items.length * REPEAT * secondsPerItem;

  function renderHalf(hidden) {
    const nodes = [];

    for (let r = 0; r < REPEAT; r++) {
      for (let i = 0; i < items.length; i++) {
        nodes.push(
          <li
            key={r + "-" + i}
            aria-hidden={hidden || r > 0 ? "true" : undefined}
            className="flex shrink-0 items-center"
          >
            <span className="whitespace-nowrap px-7 text-base font-medium text-content/75 md:px-10 md:text-lg">
              {items[i]}
            </span>
            <Star />
          </li>,
        );
      }
    }

    return (
      <ul
        aria-hidden={hidden ? "true" : undefined}
        className="flex shrink-0 items-center"
      >
        {nodes}
      </ul>
    );
  }

  return (
    <div
      role="region"
      aria-label={label}
      className={"marquee border-t border-line bg-canvas " + className}
    >
      <div className="marquee-viewport overflow-hidden py-5 md:py-6">
        <div
          className="marquee-track flex w-max"
          style={{ "--marquee-duration": duration + "s" }}
        >
          {renderHalf(false)}
          {renderHalf(true)}
        </div>
      </div>
    </div>
  );
}
