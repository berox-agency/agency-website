import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import { buildWorkCards } from "@/components/WorkCards";

export default function WorkSection({
  id = "work",
  eyebrow,
  title,
  text,
  cta,
  viewAll,
  placeholders = [],
  projects = [],
  liveText = "Live demo",
}) {
  const cards = buildWorkCards(projects, placeholders, liveText, 3);

  return (
    <section id={id} className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-site px-6 md:px-10">
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title}
          text={text}
        />

        <Reveal className="mt-14 md:mt-16">
          <ul className="grid gap-5 sm:grid-cols-2">{cards}</ul>

          {viewAll || cta ? (
            <div className="motion-hide mt-12 flex flex-wrap items-center justify-center gap-3 md:mt-14">
              {viewAll ? (
                <MagneticButton
                  href={viewAll.href}
                  variant="primary"
                  shape="pill"
                >
                  {viewAll.label}
                </MagneticButton>
              ) : null}
              {cta ? (
                <MagneticButton href={cta.href} variant="outline" shape="pill">
                  {cta.label}
                </MagneticButton>
              ) : null}
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
