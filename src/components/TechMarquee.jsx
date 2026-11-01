import { techIcons } from "@/components/TechIcons";

// Rough chip width (px) and the minimum width one half of a track must reach,
// so the loop stays seamless even on very wide monitors.
const CHIP_WIDTH = 210;
const MIN_HALF_WIDTH = 2800;

// Soft edges: the row fades out, and a gradient of backdrop blur sits on top.
const FADE =
  "linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%)";
const BLUR_LEFT = "linear-gradient(to right, #000 0%, transparent 100%)";
const BLUR_RIGHT = "linear-gradient(to left, #000 0%, transparent 100%)";

function splitRows(items, rows) {
  const result = [];

  for (let r = 0; r < rows; r++) {
    result.push([]);
  }

  for (let i = 0; i < items.length; i++) {
    result[i % rows].push(items[i]);
  }

  return result.filter(function (row) {
    return row.length > 0;
  });
}

function Chip({ icon, label }) {
  const def = techIcons[icon];

  if (!def) {
    return null;
  }

  return (
    <div className="group/chip flex h-16 items-center gap-3.5 rounded-card border border-line bg-surface/70 px-5 transition-[border-color,background-color,translate] duration-500 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface md:h-18 md:gap-4 md:px-6">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className={
          "h-7 w-7 shrink-0 transition-transform duration-500 group-hover/chip:scale-110 md:h-8 md:w-8 " +
          (def.color ? "" : "text-content")
        }
        style={def.color ? { color: def.color } : undefined}
      >
        <use href={"#tech-" + icon} />
      </svg>
      <span className="whitespace-nowrap text-[0.9375rem] font-medium text-content/85 md:text-base">
        {label}
      </span>
    </div>
  );
}

function Row({ items, index, secondsPerItem }) {
  const repeat = Math.max(
    2,
    Math.ceil(MIN_HALF_WIDTH / (items.length * CHIP_WIDTH)),
  );
  // Each row is a little slower than the one above it, for a calm parallax.
  const duration = items.length * repeat * secondsPerItem * (1 + index * 0.18);

  function renderHalf(hidden) {
    const nodes = [];

    for (let r = 0; r < repeat; r++) {
      for (let i = 0; i < items.length; i++) {
        const duplicate = hidden || r > 0;

        nodes.push(
          <li
            key={r + "-" + i}
            aria-hidden={duplicate ? "true" : undefined}
            className={
              "shrink-0 pe-4 md:pe-6 " +
              (duplicate ? "motion-reduce:hidden" : "")
            }
          >
            <Chip icon={items[i].icon} label={items[i].label} />
          </li>,
        );
      }
    }

    return (
      <ul
        aria-hidden={hidden ? "true" : undefined}
        className={
          "flex shrink-0 items-center " + (hidden ? "motion-reduce:hidden" : "")
        }
      >
        {nodes}
      </ul>
    );
  }

  return (
    <div className="marquee-viewport overflow-hidden py-1">
      <div
        className="marquee-track flex w-max"
        style={{
          "--marquee-duration": duration + "s",
          animationDirection: index % 2 === 1 ? "reverse" : "normal",
        }}
      >
        {renderHalf(false)}
        {renderHalf(true)}
      </div>
    </div>
  );
}

/*
  Multi-row infinite logo marquee with blurred, faded edges.

  Reuses the .marquee-* CSS in globals.css: pure CSS animation, flips in RTL,
  pauses on hover, and turns into a plain scrollable row (one copy of each
  item) when the visitor prefers reduced motion.

  Props
    items          [{ icon, label }] - icon is a key of techIcons
    rows           number of rows (default 2). Odd rows scroll the other way.
    label          accessible name for the region
    secondsPerItem scroll speed: lower = faster (default 4.5)
    className      extra classes for the outer element
*/
export default function TechMarquee({
  items,
  rows = 2,
  label,
  secondsPerItem = 4.5,
  className = "",
}) {
  if (!items || items.length === 0) {
    return null;
  }

  const used = [];

  for (let i = 0; i < items.length; i++) {
    if (techIcons[items[i].icon] && used.indexOf(items[i].icon) === -1) {
      used.push(items[i].icon);
    }
  }

  const groups = splitRows(items, Math.min(rows, items.length));

  return (
    <div
      role="region"
      aria-label={label}
      className={"marquee relative " + className}
    >
      {/* Every logo is defined once here and reused with <use>. */}
      <svg
        aria-hidden="true"
        focusable="false"
        width="0"
        height="0"
        className="absolute"
      >
        <defs>
          {used.map(function (key) {
            return (
              <symbol key={key} id={"tech-" + key} viewBox="0 0 24 24">
                <path d={techIcons[key].path} />
              </symbol>
            );
          })}
        </defs>
      </svg>

      <div
        className="flex flex-col gap-4 md:gap-6"
        style={{ maskImage: FADE, WebkitMaskImage: FADE }}
      >
        {groups.map(function (group, index) {
          return (
            <Row
              key={index}
              items={group}
              index={index}
              secondsPerItem={secondsPerItem}
            />
          );
        })}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[14%] backdrop-blur-[6px]"
        style={{ maskImage: BLUR_LEFT, WebkitMaskImage: BLUR_LEFT }}
      ></div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[14%] backdrop-blur-[6px]"
        style={{ maskImage: BLUR_RIGHT, WebkitMaskImage: BLUR_RIGHT }}
      ></div>
    </div>
  );
}
