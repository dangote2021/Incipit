#!/usr/bin/env python3
"""
Génère tous les PNG d'icônes à partir des SVG masters.

- icon-512.svg     → standard (paper bg, fills 50% canvas)
- icon-maskable.svg → maskable (paper bg, content in inner 80% safe zone)

Tailles produites :
- App Store marketing  : icon-1024.png        1024×1024
- iOS app icon         : apple-touch-icon.png 180×180
- Manifest standard    : icon-512.png         512×512
                         icon-192.png         192×192
- Manifest maskable    : icon-maskable-512.png 512×512
                         icon-maskable-192.png 192×192
- Favicons             : favicon-32.png       32×32
                         favicon-16.png       16×16
"""
import os
import sys
from pathlib import Path
import cairosvg

PUBLIC = Path(__file__).resolve().parent.parent / "public"

STANDARD_SVG = PUBLIC / "icon-512.svg"
MASKABLE_SVG = PUBLIC / "icon-maskable.svg"

OUTPUTS = [
    (STANDARD_SVG, "icon-1024.png", 1024),
    (STANDARD_SVG, "apple-touch-icon.png", 180),
    (STANDARD_SVG, "icon-512.png", 512),
    (STANDARD_SVG, "icon-192.png", 192),
    (STANDARD_SVG, "favicon-32.png", 32),
    (STANDARD_SVG, "favicon-16.png", 16),
    (MASKABLE_SVG, "icon-maskable-512.png", 512),
    (MASKABLE_SVG, "icon-maskable-192.png", 192),
]


def main() -> int:
    if not STANDARD_SVG.exists():
        print(f"missing {STANDARD_SVG}", file=sys.stderr)
        return 1
    if not MASKABLE_SVG.exists():
        print(f"missing {MASKABLE_SVG}", file=sys.stderr)
        return 1

    for src, name, size in OUTPUTS:
        out = PUBLIC / name
        cairosvg.svg2png(
            url=str(src),
            write_to=str(out),
            output_width=size,
            output_height=size,
        )
        print(f"  {name:30s} {size}×{size}  ← {src.name}")
    print(f"\n{len(OUTPUTS)} icônes générées dans {PUBLIC}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
