import Image from "next/image";

export default function FullLogo({ className = "h-8" }) {
  return (
    <span className={"inline-flex items-center " + className}>
      <Image
        src="/fullLogo-on-dark.png"
        alt="Berox"
        width={673}
        height={128}
        priority
        className="h-full w-auto [:root[data-theme=light]_&]:hidden"
      />
      <Image
        src="/fullLogo-on-light.png"
        alt="Berox"
        width={673}
        height={128}
        priority
        className="hidden h-full w-auto [:root[data-theme=light]_&]:block"
      />
    </span>
  );
}
