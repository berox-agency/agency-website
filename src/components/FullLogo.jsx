import Image from "next/image";

export default function FullLogo({ className = "h-8" }) {
  return (
    <span className={"inline-flex items-center " + className}>
      <Image
        src="/fullLogo-on-dark.webp"
        alt="Berox"
        width={1346}
        height={287}
        priority
        className="h-full w-auto [:root[data-theme=light]_&]:hidden"
      />
      <Image
        src="/fullLogo-on-light.webp"
        alt="Berox"
        width={1346}
        height={287}
        priority
        className="hidden h-full w-auto [:root[data-theme=light]_&]:block"
      />
    </span>
  );
}
