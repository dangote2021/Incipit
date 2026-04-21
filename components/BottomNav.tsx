"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type IconProps = { active: boolean };

const stroke = (active: boolean) => (active ? 2 : 1.5);

// Icônes line sobres, 24×24, sans emoji. Mehdi (beta) : "les emojis dans
// la nav contredisent le parti pris éditorial". Remplacés par des pictos
// line custom tracés à la main, cohérents avec la palette paper/ink/bordeaux.
function IconBook({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden>
      <path
        d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z"
        stroke="currentColor"
        strokeWidth={stroke(active)}
        strokeLinejoin="round"
      />
      <path
        d="M8 8h6M8 12h6"
        stroke="currentColor"
        strokeWidth={stroke(active)}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCompass({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeWidth={stroke(active)}
      />
      <path
        d="m14.5 9.5-2 4.5-4.5 2 2-4.5 4.5-2Z"
        stroke="currentColor"
        strokeWidth={stroke(active)}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClubs({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden>
      <circle
        cx="9"
        cy="9"
        r="3"
        stroke="currentColor"
        strokeWidth={stroke(active)}
      />
      <circle
        cx="16.5"
        cy="10.5"
        r="2.5"
        stroke="currentColor"
        strokeWidth={stroke(active)}
      />
      <path
        d="M3.5 19c0-2.8 2.5-5 5.5-5s5.5 2.2 5.5 5"
        stroke="currentColor"
        strokeWidth={stroke(active)}
        strokeLinecap="round"
      />
      <path
        d="M15 19c0-2 1.5-3.7 3.5-3.7s3.5 1.7 3.5 3.7"
        stroke="currentColor"
        strokeWidth={stroke(active)}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLibrary({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden>
      <rect
        x="4"
        y="4"
        width="3.5"
        height="16"
        rx="0.5"
        stroke="currentColor"
        strokeWidth={stroke(active)}
      />
      <rect
        x="9.5"
        y="4"
        width="3.5"
        height="16"
        rx="0.5"
        stroke="currentColor"
        strokeWidth={stroke(active)}
      />
      <path
        d="m15.8 5.3 3.4.9a.5.5 0 0 1 .35.62l-3.6 13.3a.5.5 0 0 1-.62.35l-3.4-.92a.5.5 0 0 1-.35-.61l3.6-13.3a.5.5 0 0 1 .62-.34Z"
        stroke="currentColor"
        strokeWidth={stroke(active)}
      />
    </svg>
  );
}

function IconMe({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden>
      <circle
        cx="12"
        cy="9"
        r="3.5"
        stroke="currentColor"
        strokeWidth={stroke(active)}
      />
      <path
        d="M4.5 20c0-4 3.5-6.5 7.5-6.5s7.5 2.5 7.5 6.5"
        stroke="currentColor"
        strokeWidth={stroke(active)}
        strokeLinecap="round"
      />
    </svg>
  );
}

type Tab = {
  href: string;
  label: string;
  Icon: (p: IconProps) => JSX.Element;
};

const TABS: Tab[] = [
  { href: "/", label: "Pitches", Icon: IconBook },
  { href: "/explore", label: "Explorer", Icon: IconCompass },
  { href: "/clubs", label: "Clubs", Icon: IconClubs },
  { href: "/library", label: "Bibli", Icon: IconLibrary },
  { href: "/profile", label: "Moi", Icon: IconMe },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-md border-t border-ink/10">
      <div className="max-w-xl mx-auto flex justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {TABS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex-1 flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition ${
                active ? "text-bordeaux" : "text-ink/55 hover:text-ink/85"
              }`}
            >
              <Icon active={active} />
              <span className="tracking-wide uppercase">{label}</span>
              {active && (
                <span className="absolute bottom-0 h-[2px] w-8 bg-bordeaux rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
