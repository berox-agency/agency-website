"use client";

import { useId, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

function Toggle({ open }) {
  return (
    <span
      aria-hidden="true"
      className={
        "relative grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-500 " +
        (open
          ? "border-primary bg-primary text-onprimary"
          : "border-line bg-canvas text-primary")
      }
    >
      <span className="absolute h-0.5 w-3.5 rounded-full bg-current"></span>
      <span
        className={
          "absolute h-3.5 w-0.5 rounded-full bg-current transition-transform duration-500 " +
          EASE +
          (open ? " rotate-90" : "")
        }
      ></span>
    </span>
  );
}

function Arrow() {
  return (
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
  );
}

function Item({ id, q, a, open, onToggle }) {
  return (
    <div
      data-faq-item
      className={
        "rounded-2xl border bg-surface transition-[border-color,box-shadow] duration-500 " +
        (open
          ? "border-primary/60 shadow-[0_18px_50px_-30px_var(--primary)]"
          : "border-line hover:border-primary/30")
      }
    >
      <h3>
        <button
          type="button"
          id={id + "-q"}
          aria-expanded={open}
          aria-controls={id + "-a"}
          onClick={onToggle}
          className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl p-5 text-start text-base font-semibold leading-snug outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:p-6 md:text-[1.0625rem]"
        >
          <span>{q}</span>
          <Toggle open={open} />
        </button>
      </h3>
      <div
        id={id + "-a"}
        className={
          "grid transition-[grid-template-rows,visibility] duration-500 motion-reduce:transition-none " +
          EASE +
          (open ? " visible grid-rows-[1fr]" : " invisible grid-rows-[0fr]")
        }
      >
        <div className="min-h-0 overflow-hidden">
          <p
            className={
              "px-5 pb-5 text-pretty leading-relaxed text-muted transition-[opacity,transform] duration-500 motion-reduce:transition-none md:px-6 md:pb-6 " +
              EASE +
              (open
                ? " translate-y-0 opacity-100"
                : " -translate-y-1 opacity-0")
            }
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

/*
  Reusable FAQ section: wrapped category tabs, a two-column accordion
  (one column on mobile), a "Contact us" banner and FAQPage structured data.

  Props
    id          anchor id (default "faq")
    eyebrow     small label above the title
    title       section title
    text        short intro under the title
    allLabel    label of the first tab. It is built automatically and shows
                the first question of every category tab
    tabsLabel   accessible name of the tab list
    tabs        [{ id, label, items: [{ q, a }] }]
    banner      { title, text, cta: { label, href } }  (optional)
    schema      add FAQPage JSON-LD for SEO (default true)
*/
export default function Faq({
  id = "faq",
  eyebrow,
  title,
  text,
  allLabel,
  tabsLabel,
  tabs,
  banner,
  schema = true,
}) {
  const uid = useId();
  const rootRef = useRef(null);
  const panelRefs = useRef({});
  const tabRefs = useRef([]);
  const lastTab = useRef(null);
  const [active, setActive] = useState("all");
  const [openMap, setOpenMap] = useState({});

  const allTab = {
    id: "all",
    label: allLabel,
    items: tabs.map(function (tab) {
      return tab.items[0];
    }),
  };
  const allTabs = [allTab].concat(tabs);

  useGSAP(
    function () {
      const panel = panelRefs.current[active];

      if (!panel) {
        return;
      }

      const changed = lastTab.current !== null && lastTab.current !== active;
      lastTab.current = active;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", function () {
        const vars = {
          y: 28,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "opacity,visibility,transform",
        };

        if (!changed) {
          vars.scrollTrigger = {
            trigger: panel,
            start: "top 90%",
            once: true,
          };
        }

        gsap.from(panel.querySelectorAll("[data-faq-item]"), vars);
      });

      return function () {
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [active], revertOnUpdate: true },
  );

  function toggle(tabId, index) {
    setOpenMap(function (map) {
      const current = map[tabId] === undefined ? 0 : map[tabId];
      return { ...map, [tabId]: current === index ? -1 : index };
    });
  }

  function onTabKeys(event, index) {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const step = rtl ? -1 : 1;
    let next = null;

    if (event.key === "ArrowRight") {
      next = index + step;
    } else if (event.key === "ArrowLeft") {
      next = index - step;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = allTabs.length - 1;
    }

    if (next === null) {
      return;
    }

    event.preventDefault();
    next = (next + allTabs.length) % allTabs.length;
    setActive(allTabs[next].id);
    tabRefs.current[next].focus();
  }

  const tabButtons = allTabs.map(function (tab, index) {
    const selected = tab.id === active;

    return (
      <button
        key={tab.id}
        ref={function (node) {
          tabRefs.current[index] = node;
        }}
        type="button"
        role="tab"
        id={uid + "-tab-" + tab.id}
        aria-selected={selected}
        aria-controls={uid + "-panel-" + tab.id}
        tabIndex={selected ? 0 : -1}
        onClick={function () {
          setActive(tab.id);
        }}
        onKeyDown={function (event) {
          onTabKeys(event, index);
        }}
        className={
          "h-11 cursor-pointer rounded-full border px-5 text-sm font-medium outline-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
          (selected
            ? "border-primary bg-primary text-onprimary"
            : "border-line bg-surface text-muted hover:border-primary/50 hover:text-content")
        }
      >
        {tab.label}
      </button>
    );
  });

  const panels = allTabs.map(function (tab) {
    const isActive = tab.id === active;
    const open = openMap[tab.id] === undefined ? 0 : openMap[tab.id];
    const half = Math.ceil(tab.items.length / 2);
    const columns = [tab.items.slice(0, half), tab.items.slice(half)];

    return (
      <div
        key={tab.id}
        ref={function (node) {
          panelRefs.current[tab.id] = node;
        }}
        role="tabpanel"
        id={uid + "-panel-" + tab.id}
        aria-labelledby={uid + "-tab-" + tab.id}
        hidden={!isActive}
        className={
          (isActive ? "grid " : "") +
          "items-start gap-3 md:grid-cols-2 md:gap-5"
        }
      >
        {columns.map(function (column, c) {
          return (
            <div key={c} className="flex flex-col gap-3 md:gap-5">
              {column.map(function (item, j) {
                const index = c === 0 ? j : half + j;

                return (
                  <Item
                    key={tab.id + "-" + index}
                    id={uid + "-" + tab.id + "-" + index}
                    q={item.q}
                    a={item.a}
                    open={open === index}
                    onToggle={function () {
                      toggle(tab.id, index);
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tabs
      .flatMap(function (tab) {
        return tab.items;
      })
      .map(function (item) {
        return {
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        };
      }),
  };

  return (
    <section ref={rootRef} id={id} className="scroll-mt-20 py-24 md:py-32">
      {schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}

      <div className="mx-auto max-w-site px-6 md:px-10">
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title}
          text={text}
        >
          <div
            role="tablist"
            aria-label={tabsLabel}
            className="motion-hide mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2.5"
          >
            {tabButtons}
          </div>
        </SectionHeading>

        <div className="mx-auto mt-10 max-w-6xl md:mt-12">{panels}</div>

        {banner ? (
          <Reveal className="mx-auto mt-12 max-w-6xl md:mt-16">
            <div className="motion-hide relative isolate overflow-hidden rounded-4xl bg-primary px-7 py-10 text-onprimary md:px-14 md:py-14">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-28 -inset-e-16 -z-10 h-80 w-80 rounded-full border border-onprimary/15"
              ></span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 inset-e-1/4 -z-10 h-72 w-72 rounded-full border border-onprimary/10"
              ></span>

              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
                <div className="max-w-xl">
                  <h3 className="text-balance text-3xl font-semibold leading-tight tracking-tight rtl:leading-snug rtl:tracking-normal md:text-4xl">
                    {banner.title}
                  </h3>
                  <p className="mt-3 text-pretty text-base leading-relaxed text-onprimary/90 md:text-lg">
                    {banner.text}
                  </p>
                </div>
                <MagneticButton
                  href={banner.cta.href}
                  variant="primary"
                  shape="pill"
                  className="w-full shrink-0 bg-onprimary! text-primary! focus-visible:outline-onprimary! md:w-auto"
                >
                  {banner.cta.label}
                  <Arrow />
                </MagneticButton>
              </div>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
