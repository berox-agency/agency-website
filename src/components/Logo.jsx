import Image from "next/image";

export default function Logo({ className = "h-8" }) {
  return (
    <span className={"inline-flex items-center " + className}>
      <Image
        src="/logo-on-dark.png"
        alt="Berox"
        width={673}
        height={128}
        priority
        className="h-full w-auto [:root[data-theme=light]_&]:hidden"
      />
      <Image
        src="/logo-on-light.png"
        alt="Berox"
        width={673}
        height={128}
        priority
        className="hidden h-full w-auto [:root[data-theme=light]_&]:block"
      />
    </span>
  );
}
