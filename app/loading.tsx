export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="text-center">
        <div className="font-serif text-4xl font-black text-ink/90 animate-pulse">
          Incipit<span className="text-bordeaux">.</span>
        </div>
        <div className="mt-3 text-[10px] uppercase tracking-[0.3em] text-ink/40 font-bold">
          Ça charge…
        </div>
      </div>
    </div>
  );
}
