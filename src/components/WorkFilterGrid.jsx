"use client";

import { useState, useRef, useEffect } from "react";
import { ProjectCard, GhostCard } from "@/components/WorkCards";

export default function WorkFilterGrid({
  projects,
  placeholders = [],
  filterAll,
  filterLabel,
  liveText,
  slots = 4,
}) {
  const [active, setActive] = useState("all");
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  useEffect(function () {
    return function () {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const categories = [];
  for (let i = 0; i < projects.length; i++) {
    let found = false;
    for (let j = 0; j < categories.length; j++) {
      if (categories[j] === projects[i].category) {
        found = true;
      }
    }
    if (!found) {
      categories.push(projects[i].category);
    }
  }

  function selectFilter(value) {
    if (value === active) {
      return;
    }

    setFading(true);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(function () {
      setActive(value);
      setFading(false);
    }, 160);
  }

  const chips = [];
  if (categories.length > 1) {
    const labels = [{ value: "all", label: filterAll }];
    for (let i = 0; i < categories.length; i++) {
      labels.push({ value: categories[i], label: categories[i] });
    }

    for (let i = 0; i < labels.length; i++) {
      const selected = labels[i].value === active;
      chips.push(
        <button
          key={labels[i].value}
          type="button"
          aria-pressed={selected}
          onClick={function () {
            selectFilter(labels[i].value);
          }}
          className={
            "cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary " +
            (selected
              ? "border-primary bg-primary text-onprimary"
              : "border-line text-muted hover:border-primary hover:text-primary")
          }
        >
          {labels[i].label}
        </button>,
      );
    }
  }

  const cards = [];
  let shown = 0;
  for (let i = 0; i < projects.length; i++) {
    if (active === "all" || projects[i].category === active) {
      cards.push(
        <ProjectCard
          key={projects[i].slug}
          project={projects[i]}
          liveText={liveText}
        />,
      );
      shown++;
    }
  }

  if (active === "all") {
    let ghostCount = slots - projects.length;
    if (ghostCount > placeholders.length) {
      ghostCount = placeholders.length;
    }
    for (let i = 0; i < ghostCount; i++) {
      cards.push(
        <GhostCard
          key={"ghost-" + i}
          item={placeholders[i]}
          index={i}
          reveal={false}
        />,
      );
    }
  }

  return (
    <div>
      {chips.length > 0 ? (
        <div
          role="group"
          aria-label={filterLabel}
          className="motion-hide mb-10 flex flex-wrap items-center justify-center gap-2 md:mb-12"
        >
          {chips}
        </div>
      ) : null}

      <div className="motion-hide">
        <ul
          className={
            "grid gap-5 transition-opacity duration-150 motion-reduce:transition-none sm:grid-cols-2 " +
            (fading ? "opacity-0" : "opacity-100")
          }
        >
          {cards}
        </ul>
      </div>
    </div>
  );
}
