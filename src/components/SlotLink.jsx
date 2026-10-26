"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const SPIN_ROWS = 6;
const CYCLE = -(100 * SPIN_ROWS) / (SPIN_ROWS + 2);
const ROW = "1.3em";
const ARABIC = /[\u0600-\u06FF]/;

function motionOk() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function mouseCanHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export default function SlotLink({
  as = "a",
  children,
  className = "",
  active = false,
  trailing = null,
  triggerRef = null,
  onPointerEnter,
  onPointerLeave,
  ...rest
}) {
  const Tag = as === "button" ? "button" : "a";
  const rootRef = useRef(null);
  const lineRef = useRef(null);
  const lineState = useRef({ l: 50, r: 50 });
  const hovering = useRef(false);
  const activeRef = useRef(active);
  const { contextSafe } = useGSAP({ scope: rootRef });

  function setRefs(node) {
    rootRef.current = node;
    if (triggerRef) {
      triggerRef.current = node;
    }
  }

  function paintLine() {
    const s = lineState.current;
    if (lineRef.current) {
      lineRef.current.style.clipPath =
        "inset(0 " + (100 - s.r) + "% 0 " + s.l + "%)";
    }
  }

  function percentFrom(event) {
    const rect = rootRef.current.getBoundingClientRect();
    const p = ((event.clientX - rect.left) / rect.width) * 100;
    return Math.min(Math.max(p, 0), 100);
  }

  const spin = contextSafe(function () {
    const strips = rootRef.current.querySelectorAll("[data-strip]");
    const wrap = gsap.utils.wrap(CYCLE, 0);

    for (let i = 0; i < strips.length; i++) {
      const strip = strips[i];
      const from = Number(gsap.getProperty(strip, "yPercent")) || 0;
      const turns = Math.ceil(from / CYCLE - 0.0001) + 1;

      gsap.to(strip, {
        yPercent: turns * CYCLE,
        duration: 1 + i * 0.09,
        ease: "back.out(1.3)",
        overwrite: "auto",
        modifiers: { yPercent: wrap },
        onUpdate: function () {
          strip.style.filter =
            "blur(" + (1.5 * (1 - this.progress())).toFixed(2) + "px)";
        },
        onComplete: function () {
          strip.style.filter = "none";
        },
      });
    }
  });

  const showLine = contextSafe(function (percent) {
    const s = lineState.current;

    if (s.r - s.l < 1) {
      s.l = percent;
      s.r = percent;
      paintLine();
    }

    gsap.to(s, {
      l: 0,
      r: 100,
      duration: 0.8,
      ease: "power3.out",
      overwrite: true,
      onUpdate: paintLine,
    });
    gsap.fromTo(
      lineRef.current,
      { scaleY: 2.4 },
      {
        scaleY: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.45)",
        overwrite: "auto",
      },
    );
  });

  const hideLine = contextSafe(function (percent) {
    const s = lineState.current;
    gsap.to(s, {
      l: percent,
      r: percent,
      duration: 0.65,
      ease: "power3.inOut",
      overwrite: true,
      onUpdate: paintLine,
    });
  });

  function handleEnter(event) {
    if (onPointerEnter) {
      onPointerEnter(event);
    }

    if (event.pointerType !== "mouse" || !mouseCanHover() || !motionOk()) {
      return;
    }

    hovering.current = true;
    spin();
    showLine(percentFrom(event));
  }

  function handleLeave(event) {
    if (onPointerLeave) {
      onPointerLeave(event);
    }

    if (event.pointerType !== "mouse" || !mouseCanHover() || !motionOk()) {
      return;
    }

    hovering.current = false;
    spin();

    if (!activeRef.current) {
      hideLine(percentFrom(event));
    }
  }

  useEffect(
    function () {
      activeRef.current = active;

      if (!lineRef.current) {
        return;
      }

      if (!motionOk()) {
        lineRef.current.style.clipPath = active
          ? "inset(0 0% 0 0%)"
          : "inset(0 50% 0 50%)";
        return;
      }

      if (active) {
        showLine(50);
      } else if (!hovering.current) {
        hideLine(50);
      }
    },
    [active],
  );

  const label = String(children);
  const split = !ARABIC.test(label);
  const units = split ? Array.from(label) : [label];
  const letters = [];

  for (let a = 0; a < units.length; a++) {
    if (units[a] !== " ") {
      letters.push(units[a]);
    }
  }

  const reels = [];
  let letterIndex = 0;

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];

    if (unit === " ") {
      reels.push(<span key={i} className="inline-block w-[0.3em]"></span>);
    } else {
      const rows = [];

      for (let k = 0; k < SPIN_ROWS + 2; k++) {
        rows.push(
          <span
            key={k}
            className="block whitespace-nowrap"
            style={{ height: ROW, lineHeight: ROW }}
          >
            {letters[(letterIndex + (k % SPIN_ROWS)) % letters.length]}
          </span>,
        );
      }

      reels.push(
        <span
          key={i}
          className="relative inline-block align-top [clip-path:inset(0_-0.5em)]"
          style={{ height: ROW }}
        >
          <span
            className="invisible block whitespace-nowrap"
            style={{ height: ROW, lineHeight: ROW }}
          >
            {unit}
          </span>
          <span
            data-strip
            className="absolute inset-x-0 top-0 flex flex-col items-center will-change-transform"
          >
            {rows}
          </span>
        </span>,
      );

      letterIndex = letterIndex + 1;
    }
  }

  return (
    <Tag
      ref={setRefs}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      className={
        "relative inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-content/80 transition-colors hover:text-content focus-visible:text-content focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary " +
        className
      }
      {...rest}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className="inline-flex items-center whitespace-nowrap"
      >
        {reels}
      </span>
      {trailing}
      <span
        ref={lineRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-1 h-px bg-primary"
        style={{ clipPath: "inset(0 50% 0 50%)" }}
      ></span>
    </Tag>
  );
}
