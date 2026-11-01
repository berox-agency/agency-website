import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import TechMarquee from "@/components/TechMarquee";

/*
  "Why us" band: a heading, four short strengths and a full-width strip with
  the technology marquee.

  Props
    id        anchor id for the section
    eyebrow   small label above the title
    title     main heading
    text      short paragraph under the title
    features  [{ value, text }] - 4 works best (2x2 grid)
    stack     { label, ariaLabel, items, rows?, secondsPerItem? }
    className extra classes for the section
*/
export default function WhyBerox({
  id,
  eyebrow,
  title,
  text,
  features = [],
  stack,
  className = "",
}) {
  return (
    <section id={id} className={"scroll-mt-20 py-24 md:py-32 " + className}>
      <div className="mx-auto grid max-w-site items-center gap-12 px-6 md:px-10 lg:grid-cols-2 lg:gap-20">
        <SectionHeading eyebrow={eyebrow} title={title} text={text} />

        {features.length > 0 ? (
          <Reveal
            stagger={0.08}
            className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:gap-4"
          >
            {features.map(function (feature, i) {
              return (
                <div
                  key={i}
                  className="motion-hide rounded-card border border-line bg-surface p-5 transition-[border-color,translate] duration-500 hover:-translate-y-1 hover:border-primary/50 md:p-7"
                >
                  <p className="text-[clamp(1.5rem,3vw,1.875rem)] font-semibold leading-tight tracking-tight text-primary rtl:tracking-normal">
                    {feature.value}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </Reveal>
        ) : null}
      </div>

      {stack ? (
        <div className="mt-16 border-y border-line bg-surface/40 py-8 md:mt-24 md:py-10">
          <p className="mx-auto mb-6 max-w-site px-6 text-xs font-medium uppercase tracking-[0.2em] text-muted md:mb-8 md:px-10 md:text-sm rtl:tracking-normal">
            {stack.label}
          </p>
          <TechMarquee
            items={stack.items}
            rows={stack.rows}
            secondsPerItem={stack.secondsPerItem}
            label={stack.ariaLabel || stack.label}
          />
        </div>
      ) : null}
    </section>
  );
}
