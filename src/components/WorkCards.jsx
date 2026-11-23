import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  BrowserFrame,
  PhoneFrame,
  ArrowIcon,
  ExternalIcon,
} from "@/components/WorkParts";

const SHIMMER =
  "work-shimmer pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(var(--primary-rgb)/0)_0%,rgb(var(--primary-rgb)/0.14)_50%,rgb(var(--primary-rgb)/0)_100%)]";

const MOCKUP_GLOW =
  "bg-[linear-gradient(135deg,rgb(var(--primary-rgb)/0.16)_0%,rgb(var(--primary-rgb)/0.02)_100%)]";

const BTN_PRIMARY =
  "inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-onprimary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

const BTN_OUTLINE =
  "inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-content transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

const LABEL =
  "text-xs font-semibold uppercase tracking-[0.16em] text-primary rtl:tracking-normal";

function TagList({ tags, max }) {
  if (!tags || tags.length === 0) {
    return null;
  }

  const items = [];
  const count = max && tags.length > max ? max : tags.length;

  for (let i = 0; i < count; i++) {
    items.push(
      <li
        key={tags[i]}
        className="rounded-full border border-line px-3 py-1 text-xs text-muted"
      >
        {tags[i]}
      </li>,
    );
  }

  return <ul className="flex flex-wrap gap-2">{items}</ul>;
}

function StatusBadge({ active, label }) {
  return (
    <span
      className={
        "absolute inset-s-3 top-3 z-10 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold " +
        (active
          ? "bg-primary text-onprimary"
          : "border border-line bg-surface text-muted")
      }
    >
      {active ? (
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-onprimary opacity-70 motion-safe:animate-ping"></span>
          <span className="relative h-2 w-2 rounded-full bg-onprimary"></span>
        </span>
      ) : null}
      {label}
    </span>
  );
}

export function GhostCard({ item, index, centered, reveal = true }) {
  return (
    <li
      className={
        (reveal ? "motion-hide " : "") +
        "flex flex-col rounded-3xl border border-line bg-surface p-3 sm:p-4" +
        (centered ? " sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.625rem)]" : "")
      }
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-dashed border-line bg-canvas">
        <StatusBadge active={item.status === "progress"} label={item.label} />
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col gap-3 p-4 pt-14 sm:p-5 sm:pt-16"
        >
          <span className="h-2 w-1/3 rounded-full bg-line"></span>
          <span className="min-h-0 flex-1 rounded-xl bg-line/60"></span>
          <div className="grid grid-cols-3 gap-3">
            <span className="h-7 rounded-lg bg-line/60 sm:h-9"></span>
            <span className="h-7 rounded-lg bg-line/60 sm:h-9"></span>
            <span className="h-7 rounded-lg bg-line/60 sm:h-9"></span>
          </div>
        </div>
        <span
          aria-hidden="true"
          className={SHIMMER}
          style={{ animationDelay: index * 0.7 + "s" }}
        ></span>
      </div>
      <div aria-hidden="true" className="flex flex-col gap-3 px-2 pb-2 pt-5">
        <span className="h-3.5 w-2/3 rounded-full bg-line"></span>
        <span className="h-3 w-5/6 rounded-full bg-line/70"></span>
        <div className="mt-1 flex gap-2">
          <span className="h-6 w-16 rounded-full border border-line"></span>
          <span className="h-6 w-20 rounded-full border border-line"></span>
        </div>
      </div>
    </li>
  );
}

export function FeaturedCard({ project, liveText, index = 0 }) {
  const reverse = index % 2 === 1;

  return (
    <li className="motion-hide rounded-3xl border border-line bg-surface p-3 sm:col-span-2 sm:p-4">
      <div
        className={
          "grid items-center gap-6 lg:gap-10 " +
          (reverse ? "lg:grid-cols-[7fr_5fr]" : "lg:grid-cols-[5fr_7fr]")
        }
      >
        <div
          className={
            "flex flex-col gap-4 px-2 pb-2 pt-2 " +
            (reverse ? "lg:order-2 lg:pe-6" : "lg:ps-6")
          }
        >
          <span className="inline-flex w-max items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-muted">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
            {project.badge}
          </span>
          <p className={LABEL}>{project.category}</p>
          <h3 className="text-3xl font-semibold tracking-tight rtl:tracking-normal md:text-4xl">
            {project.name}
          </h3>
          <p className="text-pretty text-lg leading-relaxed text-muted">
            {project.summary}
          </p>
          <TagList tags={project.tags} />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Link href={project.href} className={BTN_PRIMARY}>
              {project.cta}
              <ArrowIcon />
            </Link>
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className={BTN_OUTLINE}
              >
                {liveText}
                <ExternalIcon />
              </a>
            ) : null}
          </div>
        </div>

        <div
          className={
            "rounded-2xl p-4 sm:p-8 " +
            MOCKUP_GLOW +
            (reverse ? " lg:order-1" : "")
          }
        >
          <div className="relative pb-[8%] pe-[18%]">
            <BrowserFrame url={project.liveLabel}>
              {project.cover ? (
                <Image
                  src={project.cover}
                  alt={project.imageAlt || project.name}
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover object-top"
                />
              ) : null}
            </BrowserFrame>
            {project.coverMobile ? (
              <PhoneFrame className="absolute bottom-0 inset-e-0 w-[24%] min-w-[84px]">
                <Image
                  src={project.coverMobile}
                  alt=""
                  fill
                  sizes="160px"
                  className="object-cover object-top"
                />
              </PhoneFrame>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}

export function ProjectCard({ project, liveText }) {
  return (
    <li className="flex flex-col rounded-3xl border border-line bg-surface p-3 sm:p-4">
      <div className={"rounded-2xl p-4 sm:p-6 " + MOCKUP_GLOW}>
        <div className="relative pb-[8%] pe-[18%]">
          <BrowserFrame url={project.liveLabel}>
            {project.cover ? (
              <Image
                src={project.cover}
                alt={project.imageAlt || project.name}
                fill
                sizes="(min-width: 640px) 45vw, 90vw"
                className="object-cover object-top"
              />
            ) : null}
          </BrowserFrame>
          {project.coverMobile ? (
            <PhoneFrame className="absolute bottom-0 inset-e-0 w-[24%] min-w-[72px]">
              <Image
                src={project.coverMobile}
                alt=""
                fill
                sizes="140px"
                className="object-cover object-top"
              />
            </PhoneFrame>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-2 pb-2 pt-5">
        <span className="inline-flex w-max items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-muted">
          <span className="h-2 w-2 rounded-full bg-primary"></span>
          {project.badge}
        </span>
        <p className={LABEL}>{project.category}</p>
        <h3 className="text-2xl font-semibold tracking-tight rtl:tracking-normal">
          {project.name}
        </h3>
        <p className="text-pretty leading-relaxed text-muted">
          {project.summary}
        </p>
        <TagList tags={project.tags} max={3} />
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
          <Link href={project.href} className={BTN_PRIMARY}>
            {project.cta}
            <ArrowIcon />
          </Link>
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className={BTN_OUTLINE}
            >
              {liveText}
              <ExternalIcon />
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function buildWorkCards(projects, placeholders, liveText, slots) {
  const cards = [];

  for (let i = 0; i < projects.length; i++) {
    cards.push(
      <FeaturedCard
        key={projects[i].slug}
        project={projects[i]}
        liveText={liveText}
        index={i}
      />,
    );
  }

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
        centered={ghostCount === 1}
      />,
    );
  }

  return cards;
}
