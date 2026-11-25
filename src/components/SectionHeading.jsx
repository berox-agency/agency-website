import Reveal from "@/components/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  text,
  align = "start",
  as = "h2",
  className = "",
  children,
}) {
  const center = align === "center";
  const Heading = as;

  return (
    <Reveal className={(center ? "text-center " : "") + className}>
      <p
        className={
          "motion-hide flex items-center gap-3 text-lg font-medium uppercase tracking-[0.2em] text-muted rtl:tracking-normal " +
          (center ? "justify-center" : "")
        }
      >
        <span className="h-px w-10 bg-primary"></span>
        {eyebrow}
        {center ? <span className="h-px w-10 bg-primary"></span> : null}
      </p>
      <Heading
        className={
          "motion-hide mt-5 max-w-3xl text-balance text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.08] tracking-tight rtl:leading-[1.3] rtl:tracking-normal " +
          (center ? "mx-auto" : "")
        }
      >
        {title}
      </Heading>
      {text ? (
        <p
          className={
            "motion-hide mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted md:text-lg " +
            (center ? "mx-auto" : "")
          }
        >
          {text}
        </p>
      ) : null}
      {children}
    </Reveal>
  );
}
