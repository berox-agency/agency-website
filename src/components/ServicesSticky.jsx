"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import SectionHeading from "@/components/SectionHeading";
import MagneticButton from "@/components/MagneticButton";
import { ServiceIcon, serviceKeys } from "@/components/ServiceIcons";

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

export default function ServicesSticky({
  id = "services",
  eyebrow,
  title,
  text,
  cta,
  items,
}) {
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const railRef = useRef(null);

  useGSAP(
    function () {
      const wide = window.matchMedia("(min-width: 1024px)");

      function update() {
        const cards = listRef.current.querySelectorAll("[data-card]");
        const rail = railRef.current.querySelectorAll("[data-rail]");
        let active = 0;

        if (wide.matches) {
          for (let i = 0; i < cards.length; i++) {
            const stick = parseFloat(getComputedStyle(cards[i]).top);

            if (cards[i].getBoundingClientRect().top <= stick + 2) {
              active = i;
            }
          }
        }

        for (let i = 0; i < rail.length; i++) {
          rail[i].setAttribute("data-active", i === active ? "true" : "false");
        }
      }

      function layout() {
        const list = listRef.current;
        const items = list.querySelectorAll("[data-card]");
        const articles = list.querySelectorAll("[data-card] > article");

        list.removeAttribute("data-stack");

        for (let i = 0; i < articles.length; i++) {
          articles[i].style.minHeight = "";
        }

        if (wide.matches) {
          return;
        }

        let tallest = 0;

        for (let i = 0; i < articles.length; i++) {
          tallest = Math.max(tallest, articles[i].offsetHeight);
        }

        const lastTop = parseFloat(
          getComputedStyle(items[items.length - 1]).top,
        );
        const fits = lastTop + tallest <= window.innerHeight;

        if (fits) {
          for (let i = 0; i < articles.length; i++) {
            articles[i].style.minHeight = tallest + "px";
          }
        }

        list.setAttribute("data-stack", fits ? "on" : "off");
      }

      ScrollTrigger.addEventListener("refreshInit", layout);

      ScrollTrigger.create({
        trigger: listRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: update,
        onRefresh: update,
      });

      layout();
      update();

      return function () {
        ScrollTrigger.removeEventListener("refreshInit", layout);
      };
    },
    { scope: rootRef },
  );

  const railItems = [];
  const cards = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const points = [];

    for (let p = 0; p < item.points.length; p++) {
      points.push(
        <li key={p} className="flex items-start gap-2.5 text-sm text-content">
          <Check />
          <span>{item.points[p]}</span>
        </li>,
      );
    }

    railItems.push(
      <li
        key={item.title}
        data-rail
        data-active={i === 0 ? "true" : "false"}
        className="group flex items-center gap-4 py-2 [@media(max-height:820px)]:py-1 [@media(max-height:700px)]:py-0 text-muted transition-colors duration-500 data-[active=true]:text-content"
      >
        <span className="h-px w-6 bg-line transition-[width,background-color] duration-500 group-data-[active=true]:w-12 group-data-[active=true]:bg-primary"></span>
        <span className="text-xs font-medium tabular-nums">
          {"0" + (i + 1)}
        </span>
        <span className="text-sm font-medium">{item.title}</span>
      </li>,
    );

    cards.push(
      <li
        key={item.title}
        data-card
        style={{ "--i": i }}
        className="sticky top-[calc(5.5rem+var(--i)*0.75rem)] mb-5 group-data-[stack=off]/list:static lg:top-[calc(7rem+var(--i)*1.25rem)] lg:mb-10"
      >
        <article className="relative isolate overflow-hidden rounded-3xl border border-line bg-surface p-7 shadow-[0_-14px_30px_-18px_rgba(0,0,0,0.45)] md:p-10 lg:min-h-92">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--primary),transparent)]"
          ></span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 inset-e-6 -z-10 select-none text-[9rem] font-semibold leading-none tracking-tighter text-line/70 md:text-[11rem]"
          >
            {"0" + (i + 1)}
          </span>

          <span className="grid h-14 w-14 place-items-center rounded-full border border-line bg-canvas text-primary">
            <ServiceIcon name={serviceKeys[i]} className="h-6 w-6" />
          </span>
          <h3 className="mt-8 text-3xl font-semibold tracking-tight rtl:tracking-normal md:text-4xl">
            {item.title}
          </h3>
          <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted md:text-lg">
            {item.text}
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">{points}</ul>
          <a
            href={cta.href}
            className="group mt-9 inline-flex items-center gap-2 text-sm font-semibold text-primary outline-none"
          >
            <span className="border-b border-transparent pb-0.5 transition-colors duration-300 group-hover:border-primary group-focus-visible:border-primary">
              {cta.label}
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </a>
        </article>
      </li>,
    );
  }

  return (
    <section ref={rootRef} id={id} className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto grid max-w-site gap-14 px-6 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start [@media(max-height:700px)]:lg:top-24">
          <SectionHeading eyebrow={eyebrow} title={title} text={text}>
            <div className="motion-hide mt-8">
              <MagneticButton href={cta.href} variant="outline">
                {cta.label}
              </MagneticButton>
            </div>
          </SectionHeading>
          <ol
            ref={railRef}
            aria-hidden="true"
            className="mt-12 hidden border-t border-line pt-6 lg:block [@media(max-height:820px)]:mt-8 [@media(max-height:820px)]:pt-4 [@media(max-height:700px)]:mt-5 [@media(max-height:700px)]:pt-3"
          >
            {railItems}
          </ol>
        </div>

        <ol ref={listRef} className="group/list">
          {cards}
          <li
            aria-hidden="true"
            className="h-[20vh] group-data-[stack=off]/list:hidden lg:h-[28vh]"
          ></li>
        </ol>
      </div>
    </section>
  );
}
