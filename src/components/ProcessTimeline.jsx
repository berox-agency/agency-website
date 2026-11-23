"use client";

import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import MagneticButton from "@/components/MagneticButton";

const CORNER = 12;

function cornerLength(radius) {
  let length = 0;
  let prevX = 0;
  let prevY = -radius;

  for (let k = 1; k <= 24; k++) {
    const t = k / 24;
    const u = 1 - t;
    const x = t * t * radius;
    const y = -u * u * radius;

    length += Math.sqrt((x - prevX) * (x - prevX) + (y - prevY) * (y - prevY));
    prevX = x;
    prevY = y;
  }

  return length;
}

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export default function ProcessTimeline({
  id = "process",
  eyebrow,
  title,
  text,
  items,
  cta,
  readLine = 0.55,
  className = "",
}) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const svgRef = useRef(null);
  const basePathRef = useRef(null);
  const fillPathRef = useRef(null);

  useGSAP(
    function () {
      const wrap = wrapRef.current;
      const track = trackRef.current;
      const fill = fillRef.current;
      const svg = svgRef.current;
      const basePath = basePathRef.current;
      const fillPath = fillPathRef.current;
      const nodes = wrap.querySelectorAll("[data-node]");
      const steps = wrap.querySelectorAll("[data-step]");

      if (nodes.length === 0) {
        return;
      }

      const corner = cornerLength(CORNER);
      let mobile = false;
      let centers = [];
      let trackTop = 0;
      let trackHeight = 0;
      let segStarts = [];
      let segLens = [];
      let bendStarts = [];
      let pathTotal = 0;

      function measure() {
        const wrapRect = wrap.getBoundingClientRect();
        const xs = [];

        mobile = window.getComputedStyle(svg).display !== "none";
        centers = [];

        for (let i = 0; i < nodes.length; i++) {
          const rect = nodes[i].getBoundingClientRect();

          centers.push(rect.top - wrapRect.top + rect.height / 2);
          xs.push(rect.left - wrapRect.left + rect.width / 2);
        }

        trackTop = centers[0];
        trackHeight = centers[centers.length - 1] - centers[0];

        if (!mobile) {
          track.style.top = trackTop + "px";
          track.style.height = trackHeight + "px";
          return;
        }

        segStarts = [];
        segLens = [];
        bendStarts = [];
        pathTotal = 0;

        let d = "M " + xs[0] + " " + centers[0];

        for (let i = 0; i < nodes.length - 1; i++) {
          const stepRect = steps[i].getBoundingClientRect();
          const padBottom = parseFloat(
            window.getComputedStyle(steps[i]).paddingBottom,
          );
          const yh = stepRect.bottom - wrapRect.top - padBottom / 2;
          const dir = xs[i + 1] > xs[i] ? 1 : -1;
          const dx = Math.abs(xs[i + 1] - xs[i]);

          d +=
            " L " +
            xs[i] +
            " " +
            (yh - CORNER) +
            " Q " +
            xs[i] +
            " " +
            yh +
            " " +
            (xs[i] + dir * CORNER) +
            " " +
            yh +
            " L " +
            (xs[i + 1] - dir * CORNER) +
            " " +
            yh +
            " Q " +
            xs[i + 1] +
            " " +
            yh +
            " " +
            xs[i + 1] +
            " " +
            (yh + CORNER) +
            " L " +
            xs[i + 1] +
            " " +
            centers[i + 1];

          const segLen =
            yh -
            CORNER -
            centers[i] +
            corner * 2 +
            (dx - 2 * CORNER) +
            (centers[i + 1] - yh - CORNER);

          segStarts.push(pathTotal);
          segLens.push(segLen);
          bendStarts.push(yh - CORNER);
          pathTotal += segLen;
        }

        basePath.setAttribute("d", d);
        fillPath.setAttribute("d", d);
        fillPath.style.strokeDasharray = pathTotal + "px " + pathTotal + "px";
      }

      function update() {
        const line =
          window.innerHeight * readLine - wrap.getBoundingClientRect().top;

        if (mobile) {
          let drawn = 0;

          for (let i = 0; i < segLens.length; i++) {
            if (line <= centers[i]) {
              break;
            }

            const span = centers[i + 1] - centers[i];
            const win = Math.max(
              centers[i + 1] - bendStarts[i] + 8,
              Math.min(200, span * 0.4),
            );
            const winStart = centers[i + 1] - win;
            let part = 0;

            if (line >= centers[i + 1]) {
              part = segLens[i];
            } else if (line <= winStart) {
              part = line - centers[i];
            } else {
              const base = winStart - centers[i];

              part = base + ((line - winStart) / win) * (segLens[i] - base);
            }

            drawn = segStarts[i] + part;
          }

          fillPath.style.strokeDashoffset = pathTotal - drawn + "px";
        } else {
          let reach = line - trackTop;

          if (reach < 0) {
            reach = 0;
          }

          if (reach > trackHeight) {
            reach = trackHeight;
          }

          const progress = trackHeight > 0 ? reach / trackHeight : 0;

          fill.style.transform = "scaleY(" + progress + ")";
        }

        for (let i = 0; i < steps.length; i++) {
          steps[i].setAttribute(
            "data-active",
            line >= centers[i] ? "true" : "false",
          );
        }
      }

      function onLoad() {
        ScrollTrigger.refresh();
      }

      ScrollTrigger.addEventListener("refreshInit", measure);

      ScrollTrigger.create({
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        onUpdate: update,
        onRefresh: update,
      });

      if (document.readyState !== "complete") {
        window.addEventListener("load", onLoad);
      }

      measure();
      update();

      return function () {
        ScrollTrigger.removeEventListener("refreshInit", measure);
        window.removeEventListener("load", onLoad);
      };
    },
    { scope: wrapRef, dependencies: [items, readLine] },
  );

  const rows = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const cardLeft = i % 2 === 0;
    const spineLeft = i % 2 === 0;
    const points = [];

    if (item.points) {
      for (let p = 0; p < item.points.length; p++) {
        points.push(
          <li key={p} className="flex items-start gap-2.5 text-sm text-content">
            <Check />
            <span>{item.points[p]}</span>
          </li>,
        );
      }
    }

    rows.push(
      <li
        key={item.title}
        data-step
        data-active={i === 0 ? "true" : "false"}
        className={
          "group/step relative grid gap-x-3 pb-14 last:pb-0 md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] md:gap-x-12 md:pb-16 " +
          (spineLeft
            ? "grid-cols-[2rem_minmax(0,1fr)]"
            : "grid-cols-[minmax(0,1fr)_2rem]")
        }
      >
        <span
          data-node
          aria-hidden="true"
          className={
            "relative z-10 row-start-1 grid h-8 w-8 place-items-center self-start justify-self-center rounded-full border border-line bg-canvas text-xs font-semibold tabular-nums text-muted transition-[background-color,border-color,color,box-shadow] duration-500 motion-reduce:transition-none md:col-start-2 md:h-12 md:w-12 md:text-base group-data-[active=true]/step:border-primary group-data-[active=true]/step:bg-primary group-data-[active=true]/step:text-onprimary group-data-[active=true]/step:shadow-[0_0_0_4px_rgb(var(--primary-rgb)/0.18)] md:group-data-[active=true]/step:shadow-[0_0_0_6px_rgb(var(--primary-rgb)/0.18)] " +
            (spineLeft ? "col-start-1" : "col-start-2")
          }
        >
          {i + 1}
        </span>

        <Reveal
          className={
            "relative row-start-1 " +
            (spineLeft ? "col-start-2" : "col-start-1") +
            (cardLeft ? " md:col-start-1" : " md:col-start-3")
          }
        >
          <span
            aria-hidden="true"
            className={
              "motion-hide pointer-events-none absolute top-6 hidden h-px w-12 bg-line transition-colors duration-500 motion-reduce:transition-none md:block group-data-[active=true]/step:bg-primary " +
              (cardLeft ? "-inset-e-12" : "-inset-s-12")
            }
          ></span>
          <article className="motion-hide relative isolate overflow-hidden rounded-3xl border border-line bg-surface p-5 transition-[border-color,box-shadow] duration-500 motion-reduce:transition-none md:p-8 group-data-[active=true]/step:border-primary/50 group-data-[active=true]/step:shadow-[0_18px_50px_-26px_rgb(var(--primary-rgb)/0.55)]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-3 inset-e-3 -z-10 select-none text-[5rem] font-semibold leading-none tracking-tighter text-line/70 md:-top-4 md:inset-e-4 md:text-[8rem]"
            >
              {"0" + (i + 1)}
            </span>
            <h3 className="text-xl font-semibold tracking-tight rtl:tracking-normal md:text-3xl">
              {item.title}
            </h3>
            <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted md:mt-3 md:text-base">
              {item.text}
            </p>
            {points.length > 0 ? (
              <ul className="mt-5 grid gap-3 md:mt-6">{points}</ul>
            ) : null}
          </article>
        </Reveal>
      </li>,
    );
  }

  return (
    <section id={id} className={"scroll-mt-20 py-24 md:py-32 " + className}>
      <div className="mx-auto max-w-site px-6 md:px-10">
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title}
          text={text}
        />

        <div ref={wrapRef} className="relative mt-16 md:mt-24">
          <svg
            ref={svgRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible md:hidden"
          >
            <path
              ref={basePathRef}
              className="fill-none stroke-line"
              strokeWidth="2"
            />
            <path
              ref={fillPathRef}
              className="fill-none stroke-primary"
              strokeWidth="2"
            />
          </svg>
          <span
            ref={trackRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-s-1/2 -ms-px hidden w-0.5 bg-line md:block"
          >
            <span
              ref={fillRef}
              className="absolute inset-0 origin-top scale-y-0 bg-primary"
            ></span>
          </span>
          <ol>{rows}</ol>
        </div>

        {cta ? (
          <Reveal className="mt-14 flex justify-center md:mt-20">
            <div className="motion-hide">
              <MagneticButton href={cta.href}>{cta.label}</MagneticButton>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
