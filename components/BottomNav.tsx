"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Pitches", icon: "📖" },
  { href: "/explore", label: "Explorer", icon: "🧭" },
  { href: "/clubs", label: "Clubs", icon: "👥" },
  { href: "/library", label: "Bibli", icon: "🗂️" },
  { href: "/profile", label: "Moi", icon: "🦉" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-md border-t border-ink/10">
      <div className="max-w-xl mx-auto flex justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {TABS.map((t) => {
          const active = isActive(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`relative flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition ${
                active ? "text-bordeaux" : "text-ink/50 hover:text-ink/80"
              }`}
            >
              <span className={`text-xl ${active ? "" : "grayscale opacity-70"}`}>
                {t.icon}
              </span>
              <span className="tracking-wide uppercase">{t.label}</span>
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
