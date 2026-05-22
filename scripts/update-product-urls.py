#!/usr/bin/env python3
"""Update product URLs to alacamdagitim.com using handles from Shopify CSV exports."""

from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS_PATH = ROOT / "src/data/products.json"
STORE_BASE = "https://www.alacamdagitim.com"

DEFAULT_CSV_PATHS = [
    Path.home() / "Downloads/products_export_1 18.csv",
    Path.home() / "Downloads/products_export_2 3.csv",
]

TR = str.maketrans("ığüşöçİĞÜŞÖÇ", "igusocigusoc")


def normalize_title(title: str) -> str:
    text = str(title).translate(TR).lower()
    text = re.sub(r"\s+", " ", text).strip()
    return text


def load_csv_rows(paths: list[Path]) -> list[dict]:
    rows: list[dict] = []
    seen_handles: set[str] = set()

    for path in paths:
        if not path.exists():
            print(f"Warning: CSV not found: {path}")
            continue

        with path.open(encoding="utf-8") as handle_file:
            for row in csv.DictReader(handle_file):
                handle = row.get("Handle", "").strip()
                title = row.get("Title", "").strip()
                sku = row.get("Variant SKU", "").strip()
                barcode = row.get("Variant Barcode", "").strip()

                if not handle or not title:
                    continue

                entry = {
                    "handle": handle,
                    "title": title,
                    "sku": sku.upper() if sku else "",
                    "barcode": barcode,
                    "norm": normalize_title(title),
                }

                rows.append(entry)
                seen_handles.add(handle)

    return rows


def extract_handle_from_url(url: str) -> str | None:
    if not url or "/products/" not in url:
        return None
    return url.split("/products/")[-1].split("?")[0].strip("/") or None


def resolve_handle(product: dict, by_title: dict[str, str], by_sku: dict[str, str]) -> str | None:
    url_handle = extract_handle_from_url(product.get("productUrl", ""))
    if url_handle:
        return url_handle

    sku = str(product.get("sku", "")).upper()
    if sku and sku in by_sku:
        return by_sku[sku]

    norm = normalize_title(product["title"])
    if norm in by_title:
        return by_title[norm]

    return None


def main() -> None:
    csv_paths = [Path(p) for p in sys.argv[1:]] if len(sys.argv) > 1 else DEFAULT_CSV_PATHS
    csv_rows = load_csv_rows(csv_paths)

    by_title: dict[str, str] = {}
    by_sku: dict[str, str] = {}
    for row in csv_rows:
        by_title.setdefault(row["norm"], row["handle"])
        if row["sku"]:
            by_sku.setdefault(row["sku"], row["handle"])
        if row["barcode"]:
            by_sku.setdefault(row["barcode"], row["handle"])

    products = json.loads(PRODUCTS_PATH.read_text(encoding="utf-8"))

    updated = 0
    removed = 0
    unchanged = 0

    for product in products:
        handle = resolve_handle(product, by_title, by_sku)
        new_url = f"{STORE_BASE}/products/{handle}" if handle else None
        old_url = product.get("productUrl")

        if new_url:
            product["productUrl"] = new_url
            if old_url != new_url:
                updated += 1
            else:
                unchanged += 1
        elif old_url:
            product.pop("productUrl", None)
            removed += 1

    PRODUCTS_PATH.write_text(
        json.dumps(products, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    with_url = sum(1 for p in products if p.get("productUrl"))
    without_url = len(products) - with_url

    print(f"Store base: {STORE_BASE}")
    print(f"CSV rows loaded: {len(csv_rows)}")
    print(f"Updated URLs: {updated}")
    print(f"Unchanged URLs: {unchanged}")
    print(f"Removed URLs (no CSV handle): {removed}")
    print(f"With productUrl: {with_url}/{len(products)}")
    print(f"Without productUrl: {without_url}")


if __name__ == "__main__":
    main()
