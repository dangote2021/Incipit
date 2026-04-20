"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  title?: string;
  subtitle?: string;
  back?: boolean;
  action?: React.ReactNode;
};

export default function AppHeader({ title, subtitle, back, action }: Props) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur-md border-b border-ink/5">
      <div className="max-w-xl mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {back && (
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  router.back();
                } else {
                  router.push("/");
                }
              }}
              aria-label="Retour"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-ink/5 hover:bg-ink/10 transition text-ink/80"
            >
              ←
            </button>
          )}
          <div>
            {title ? (
              <h1 className="font-serif text-2xl font-bold text-ink leading-none">
                {title}
              </h1>
            ) : (
              <Link href="/" className="flex items-baseline gap-1">
                <span className="font-serif font-black text-3xl tracking-tight text-ink">
                  Incipit
                </span>
                <span className="text-bordeaux text-2xl">.</span>
              </Link>
            )}
            {subtitle && (
              <p className="text-xs text-ink/60 mt-0.5 tracking-wide">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action}
      </div>
    </header>
  );
}
