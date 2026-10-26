"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import Logo from "@/components/Logo";
import SlotLink from "@/components/SlotLink";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MagneticButton from "@/components/MagneticButton";

function motionAllowed() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const mobileItemClass =
  "group flex w-full cursor-pointer items-center py-1.5 text-start text-[length:clamp(1.75rem,7.5dvh,3.5rem)] font-semibold leading-[1.05] tracking-tight transition-colors duration-300 hover:text-primary active:text-primary rtl:tracking-normal";

const mobileBarClass =
  "h-px w-0 shrink-0 bg-primary transition-[width,margin] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:me-4 group-hover:w-10 group-active:me-4 group-active:w-10";

export default function Navbar({ links, cta, menuLabel, closeLabel }) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const navRef = useRef(null);
  const bgRef = useRef(null);
  const overlayRef = useRef(null);
  const servicesRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const closeTimer = useRef(null);
  const servicesOpenRef = useRef(false);

  const { contextSafe } = useGSAP(
    function () {
      function onScroll() {
        if (bgRef.current) {
          bgRef.current.classList.toggle("is-scrolled", window.scrollY > 24);
        }
      }

      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });

      if (panelRef.current) {
        gsap.set(panelRef.current, {
          y: 10,
          scale: 0.98,
          transformOrigin: "50% 0%",
        });
      }

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", function () {
        gsap.from(navRef.current, {
          autoAlpha: 0,
          y: -24,
          duration: 0.9,
          delay: 0.1,
          ease: "power3.out",
        });
      });

      return function () {
        window.removeEventListener("scroll", onScroll);
        mm.revert();
      };
    },
    { scope: navRef },
  );

  const showServices = contextSafe(function () {
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    const items = panel.querySelectorAll("[data-service-item]");
    const ok = motionAllowed();

    gsap.to(panel, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: ok ? 0.55 : 0,
      ease: "back.out(1.5)",
      overwrite: "auto",
    });

    if (ok) {
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.045,
          delay: 0.05,
          overwrite: "auto",
        },
      );
    } else {
      gsap.set(items, { autoAlpha: 1, y: 0 });
    }
  });

  const hideServices = contextSafe(function () {
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    gsap.to(panel, {
      autoAlpha: 0,
      y: 8,
      scale: 0.98,
      duration: motionAllowed() ? 0.2 : 0,
      ease: "power2.in",
      overwrite: "auto",
    });
  });

  function openServices() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    if (servicesOpenRef.current) {
      return;
    }

    servicesOpenRef.current = true;
    setServicesOpen(true);
    showServices();
  }

  function closeServices() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    if (!servicesOpenRef.current) {
      return;
    }

    servicesOpenRef.current = false;
    setServicesOpen(false);
    hideServices();
  }

  function scheduleCloseServices() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }

    closeTimer.current = setTimeout(closeServices, 180);
  }

  useGSAP(
    function () {
      if (!open) {
        return undefined;
      }

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", function () {
        const items = overlayRef.current.querySelectorAll("[data-menu-item]");
        gsap.from(overlayRef.current, {
          autoAlpha: 0,
          duration: 0.35,
          ease: "power2.out",
        });
        gsap.from(items, {
          yPercent: 110,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.08,
          delay: 0.1,
        });
      });

      return function () {
        mm.revert();
      };
    },
    { dependencies: [open] },
  );

  useEffect(
    function () {
      if (!open) {
        return undefined;
      }

      document.body.style.overflow = "hidden";

      function onKey(event) {
        if (event.key === "Escape") {
          setOpen(false);
        }
      }

      window.addEventListener("keydown", onKey);

      return function () {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKey);
      };
    },
    [open],
  );

  useEffect(
    function () {
      if (!servicesOpen) {
        return undefined;
      }

      function onKey(event) {
        if (event.key === "Escape") {
          closeServices();
          if (triggerRef.current) {
            triggerRef.current.focus();
          }
        }
      }

      function onDown(event) {
        if (
          servicesRef.current &&
          !servicesRef.current.contains(event.target)
        ) {
          closeServices();
        }
      }

      window.addEventListener("keydown", onKey);
      document.addEventListener("pointerdown", onDown);

      return function () {
        window.removeEventListener("keydown", onKey);
        document.removeEventListener("pointerdown", onDown);
      };
    },
    [servicesOpen],
  );

  useEffect(function () {
    return function () {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    };
  }, []);

  function closeMenu() {
    setOpen(false);
  }

  function toggleMenu() {
    setOpen(!open);
  }

  const desktopLinks = [];
  const mobileLinks = [];

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const hasChildren = link.children && link.children.length > 0;

    if (hasChildren) {
      const serviceItems = [];

      for (let j = 0; j < link.children.length; j++) {
        const child = link.children[j];

        serviceItems.push(
          <a
            key={child.label}
            data-service-item
            href={child.href}
            onClick={closeServices}
            className="group/item flex items-center gap-4 rounded-button border border-transparent p-4 transition-[background-color,border-color] duration-300 hover:border-primary/40 hover:bg-primary/15 focus-visible:border-primary/40 focus-visible:bg-primary/15 focus-visible:outline-none"
          >
            <span className="w-7 shrink-0 text-sm font-medium text-primary">
              {String(j + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{child.label}</span>
              <span className="mt-1 block text-sm leading-snug text-muted">
                {child.description}
              </span>
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="ms-auto h-5 w-5 shrink-0 text-muted transition duration-300 group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 group-hover/item:text-primary group-focus-visible/item:text-primary rtl:-scale-x-100 rtl:group-hover/item:-translate-x-0.5"
            >
              <path d="M7 17L17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </a>,
        );
      }

      desktopLinks.push(
        <div
          key={link.label}
          ref={servicesRef}
          className="flex h-20 items-center"
          onPointerEnter={function (event) {
            if (event.pointerType === "mouse") {
              openServices();
            }
          }}
          onPointerLeave={function (event) {
            if (event.pointerType === "mouse") {
              scheduleCloseServices();
            }
          }}
          onBlur={function (event) {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              closeServices();
            }
          }}
        >
          <SlotLink
            as="button"
            type="button"
            triggerRef={triggerRef}
            active={servicesOpen}
            aria-haspopup="true"
            aria-expanded={servicesOpen}
            aria-controls="services-menu"
            onClick={openServices}
            trailing={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={
                  "h-3.5 w-3.5 transition-transform duration-300 " +
                  (servicesOpen ? "rotate-180" : "")
                }
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            }
          >
            {link.label}
          </SlotLink>

          <div className="pointer-events-none absolute left-1/2 top-full w-184 max-w-[calc(100vw-3rem)] -translate-x-1/2">
            <div
              id="services-menu"
              ref={panelRef}
              className="pointer-events-auto invisible pt-2 opacity-0"
            >
              <div className="rounded-card border border-line bg-canvas/75 p-2 shadow-2xl shadow-black/25 backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-1.5">{serviceItems}</div>
              </div>
            </div>
          </div>
        </div>,
      );
    } else {
      desktopLinks.push(
        <SlotLink key={link.label} href={link.href}>
          {link.label}
        </SlotLink>,
      );
    }

    mobileLinks.push(
      <div key={link.label} className="overflow-hidden">
        <a
          data-menu-item
          href={link.href}
          onClick={closeMenu}
          className={mobileItemClass}
        >
          <span aria-hidden="true" className={mobileBarClass}></span>
          <span>{link.label}</span>
        </a>
      </div>,
    );
  }

  return (
    <>
      <header ref={navRef} className="motion-hide fixed inset-x-0 top-0 z-50">
        <div
          ref={bgRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-300 [&.is-scrolled]:border-line [&.is-scrolled]:bg-canvas/70 [&.is-scrolled]:backdrop-blur-xl"
        ></div>

        <div className="relative mx-auto flex h-20 max-w-site items-center px-6 md:px-10">
          <div className="flex flex-1 items-center">
            <Link href="/" className="inline-flex cursor-pointer items-center">
              <Logo className="h-8 md:h-9" />
            </Link>
          </div>

          <nav
            aria-label="Primary"
            className="relative hidden items-center gap-10 lg:flex"
          >
            {desktopLinks}
          </nav>

          <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
            <ThemeToggle />
            <LanguageSwitcher />
            <MagneticButton href={cta.href} size="sm">
              {cta.label}
            </MagneticButton>
          </div>

          <div className="flex flex-1 items-center justify-end lg:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? closeLabel : menuLabel}
              className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-button border border-line bg-surface"
            >
              <span
                className={
                  "absolute h-px w-5 bg-content transition-transform duration-300 " +
                  (open ? "rotate-45" : "-translate-y-1.5")
                }
              ></span>
              <span
                className={
                  "absolute h-px w-5 bg-content transition-transform duration-300 " +
                  (open ? "-rotate-45" : "translate-y-1.5")
                }
              ></span>
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id="mobile-menu"
          ref={overlayRef}
          className="fixed inset-x-0 top-0 z-40 flex h-dvh touch-none flex-col overflow-hidden overscroll-contain bg-canvas px-6 pb-6 pt-24 lg:hidden [@media(max-height:480px)]:flex-row [@media(max-height:480px)]:gap-10 [@media(max-height:480px)]:pt-20"
        >
          <nav
            aria-label="Mobile"
            className="flex min-h-0 flex-1 flex-col justify-evenly"
          >
            {mobileLinks}
          </nav>
          <div className="flex shrink-0 flex-col gap-4 border-t border-line pt-5 [@media(max-height:480px)]:w-72 [@media(max-height:480px)]:justify-end [@media(max-height:480px)]:border-s [@media(max-height:480px)]:border-t-0 [@media(max-height:480px)]:ps-10 [@media(max-height:480px)]:pt-0">
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            <MagneticButton
              href={cta.href}
              onClick={closeMenu}
              className="w-full"
            >
              {cta.label}
            </MagneticButton>
          </div>
        </div>
      ) : null}
    </>
  );
}
