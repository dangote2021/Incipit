"use client";

import { useState } from "react";

export default function AdminActions({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const [busy, setBusy] = useState(false);

  async function setStatus(newStatus: "approved" | "rejected" | "active") {
    setBusy(true);
    try {
      const res = await fetch("/api/beta/approve", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Échec : " + res.statusText);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {currentStatus !== "approved" && (
        <button
          onClick={() => setStatus("approved")}
          disabled={busy}
          className="px-3 py-1.5 bg-sage text-paper rounded-full text-xs uppercase tracking-widest font-bold disabled:opacity-50"
        >
          ✓ Approuver
        </button>
      )}
      {currentStatus !== "active" && (
        <button
          onClick={() => setStatus("active")}
          disabled={busy}
          className="px-3 py-1.5 bg-ink text-paper rounded-full text-xs uppercase tracking-widest font-bold disabled:opacity-50"
        >
          ▶ Activer
        </button>
      )}
      {currentStatus !== "rejected" && (
        <button
          onClick={() => setStatus("rejected")}
          disabled={busy}
          className="px-3 py-1.5 bg-bordeaux/80 text-paper rounded-full text-xs uppercase tracking-widest font-bold disabled:opacity-50"
        >
          ✗ Rejeter
        </button>
      )}
    </div>
  );
}
