"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const variants = {
  primary: {
    base: "bg-primary text-onprimary",
    fill: "bg-content text-canvas",
  },
  outline: {
    base: "border border-line bg-surface text-content",
    fill: "bg-primary text-onprimary",
  },
};

const shapes = {
  default: "rounded-button",
  pill: "rounded-full",
};

const sizes = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-4 text-sm",
  hero: "h-[clamp(2.75rem,7svh,3.25rem)] px-7 text-[0.9375rem] sm:text-sm",
  icon: "h-[3.25rem] w-[3.25rem] text-sm",
};

export default function MagneticButton({
  href,
  children,
  variant = "primary",
  size = "md",
  shape = "default",
  strength = 0.35,
  className = "",
  onClick,
  attention = false,
  ...rest
}) {
  const ref = useRef(null);
  const fillRef = useRef(null);

  useGSAP(
    function () {
      const el = ref.current;
      const fill = fillRef.current;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", function () {
        const moveX = gsap.quickTo(el, "x", {
          duration: 1,
          ease: "elastic.out(1, 0.45)",
        });
        const moveY = gsap.quickTo(el, "y", {
          duration: 1,
          ease: "elastic.out(1, 0.45)",
        });
        const state = { x: 0, y: 0, r: 0 };

        function paint() {
          fill.style.clipPath =
            "circle(" + state.r + "px at " + state.x + "px " + state.y + "px)";
        }

        function localPoint(event) {
          const rect = el.getBoundingClientRect();
          const x = Math.min(
            Math.max(event.clientX - rect.left, 0),
            rect.width,
          );
          const y = Math.min(
            Math.max(event.clientY - rect.top, 0),
            rect.height,
          );
          return { x: x, y: y, w: rect.width, h: rect.height };
        }

        function reach(point) {
          const dx = Math.max(point.x, point.w - point.x);
          const dy = Math.max(point.y, point.h - point.y);
          return Math.sqrt(dx * dx + dy * dy) + 2;
        }

        function isMouse(event) {
          return event.pointerType === "mouse";
        }

        function onEnter(event) {
          const point = localPoint(event);

          if (state.r < 1) {
            state.x = point.x;
            state.y = point.y;
          }

          gsap.to(state, {
            x: point.x,
            y: point.y,
            r: reach(point),
            duration: isMouse(event) ? 0.75 : 0.5,
            ease: "power3.out",
            overwrite: true,
            onUpdate: paint,
          });
        }

        function onMove(event) {
          if (!isMouse(event)) {
            return;
          }

          const rect = el.getBoundingClientRect();
          const dx = event.clientX - (rect.left + rect.width / 2);
          const dy = event.clientY - (rect.top + rect.height / 2);
          moveX(dx * strength);
          moveY(dy * strength);
        }

        function onLeave(event) {
          const point = localPoint(event);

          moveX(0);
          moveY(0);

          gsap.to(state, {
            x: point.x,
            y: point.y,
            r: 0,
            duration: 0.65,
            delay: isMouse(event) ? 0 : 0.3,
            ease: "power3.inOut",
            overwrite: true,
            onUpdate: paint,
          });
        }

        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        el.addEventListener("pointercancel", onLeave);

        return function () {
          el.removeEventListener("pointerenter", onEnter);
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          el.removeEventListener("pointercancel", onLeave);
          gsap.killTweensOf(state);
          fill.style.clipPath = "circle(0px at 50% 50%)";
        };
      });

      mm.add("(prefers-reduced-motion: no-preference)", function () {
        function onDown() {
          gsap.to(el, {
            scale: 0.96,
            duration: 0.15,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        function onUp() {
          gsap.to(el, {
            scale: 1,
            duration: 0.9,
            ease: "elastic.out(1, 0.4)",
            overwrite: "auto",
          });
        }

        el.addEventListener("pointerdown", onDown);
        el.addEventListener("pointerup", onUp);
        el.addEventListener("pointerleave", onUp);
        el.addEventListener("pointercancel", onUp);

        return function () {
          el.removeEventListener("pointerdown", onDown);
          el.removeEventListener("pointerup", onUp);
          el.removeEventListener("pointerleave", onUp);
          el.removeEventListener("pointercancel", onUp);
        };
      });

      return function () {
        mm.revert();
      };
    },
    { scope: ref },
  );

  const style = variants[variant];

  const classes =
    "group relative inline-flex cursor-pointer items-center justify-center overflow-hidden font-semibold will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
    shapes[shape] +
    " " +
    style.base +
    " " +
    sizes[size] +
    " " +
    (attention ? "cta-attention " : "") +
    className;

  return (
    <a ref={ref} href={href} onClick={onClick} className={classes} {...rest}>
      <span className="relative inline-flex items-center justify-center gap-2">
        {children}
      </span>
      <span
        ref={fillRef}
        aria-hidden="true"
        className={
          "pointer-events-none absolute inset-0 flex items-center justify-center gap-2 " +
          style.fill
        }
        style={{ clipPath: "circle(0px at 50% 50%)" }}
      >
        {children}
      </span>
    </a>
  );
}
