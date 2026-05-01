// ─────────────────────────────────────────────────────────────────────────────
// <Logo /> — la marque graphique Incipit (lettrine I + point bordeaux).
//
// Composant SVG inline, scalable via la prop `size`. Définie comme un
// composant React (pas un <img>) pour qu'on puisse :
// - inverser les couleurs (variant "dark" sur fond ink)
// - changer la couleur du point (or vs bordeaux selon le contexte)
// - servir le tout en flux côté SSR sans dépendance HTTP supplémentaire
//
// Le master vectoriel partagé avec public/icon-*.svg utilise les MÊMES
// coordonnées de path (canvas 1024×1024). Si tu modifies l'une, modifie
// l'autre — sinon l'icon home screen et le logo d'app divergent.
// ─────────────────────────────────────────────────────────────────────────────

type Variant = "light" | "dark";

type Props = {
  /** Largeur ET hauteur en pixels (le logo est carré). Default 56. */
  size?: number;
  /** "light" : ink sur paper (défaut), "dark" : paper sur ink. */
  variant?: Variant;
  /** Couleur du point — défaut bordeaux. Le gold marche bien sur dark. */
  dotColor?: "bordeaux" | "gold";
  /** Si vrai, ajoute des coins arrondis (icône carrée style app icon).
   *  Défaut : false (la lettrine respire mieux sans cadre). */
  rounded?: boolean;
  className?: string;
  /** Override du <title> SVG pour les lecteurs d'écran. */
  title?: string;
};

const COLORS = {
  paper: "#FAF7F0",
  ink: "#1A1A2E",
  bordeaux: "#8A1234",
  gold: "#C9A961",
};

export default function Logo({
  size = 56,
  variant = "light",
  dotColor = "bordeaux",
  rounded = false,
  className = "",
  title = "Incipit",
}: Props) {
  const bg = variant === "light" ? COLORS.paper : COLORS.ink;
  const fg = variant === "light" ? COLORS.ink : COLORS.paper;
  const dot = COLORS[dotColor];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      {rounded ? (
        <rect width="1024" height="1024" rx="220" fill={bg} />
      ) : (
        <rect width="1024" height="1024" fill={bg} />
      )}
      <path
        fill={fg}
        d="M 360 232 L 640 232 L 640 274 L 540 274 L 540 750 L 640 750 L 640 792 L 360 792 L 360 750 L 460 750 L 460 274 L 360 274 Z"
      />
      <circle cx="710" cy="770" r="44" fill={dot} />
    </svg>
  );
}
