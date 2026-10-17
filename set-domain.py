#!/usr/bin/env python3
"""Replace the YOUR-DOMAIN placeholder with your real site address.

Usage:  python3 set-domain.py https://yourname.com
"""
import pathlib
import sys

if len(sys.argv) != 2 or not sys.argv[1].startswith("https://"):
    sys.exit("Usage: python3 set-domain.py https://yourname.com")

domain = sys.argv[1].rstrip("/")
changed = []
for name in ("index.html", "robots.txt", "sitemap.xml"):
    path = pathlib.Path(__file__).parent / name
    text = path.read_text(encoding="utf-8")
    if "https://YOUR-DOMAIN" in text:
        path.write_text(text.replace("https://YOUR-DOMAIN", domain), encoding="utf-8")
        changed.append(name)

print("Updated:", ", ".join(changed) if changed else "nothing (already set)")
