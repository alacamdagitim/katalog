#!/usr/bin/env python3
"""Sync catalog prices from mix ozmer fiyat listesi.xlsx and add Limpo/Repo products."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import pandas as pd
from rapidfuzz import fuzz, process

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS_PATH = ROOT / "src/data/products.json"
DEFAULT_XLSX = Path.home() / "Desktop/mix ozmer fiyat listesi.xlsx"

TR = str.maketrans("ığüşöçİĞÜŞÖÇ", "igusocigusoc")

BRAND_TO_CATEGORY = {
    "Fo": "Fo",
    "Repo": "Repo",
    "Limpo": "Limpo",
    "Unico Mix": "Unicomix",
}

FLR_CATEGORIES = ("Fo", "Limpo", "Repo")

MATCH_THRESHOLDS = {
    "Unicomix": 78,
    "flr": 82,
}


def parse_price(value) -> float:
    text = str(value).replace("₺", "").replace(".", "").replace(",", ".").strip()
    return float(text)


def format_price(value: float) -> str:
    return f"{value:.2f}"


def normalize_title(title: str) -> str:
    text = str(title).translate(TR).lower()
    text = re.sub(r"^(fo|limpo|repo|unicomix|unico mix|fumer)\s+", "", text)
    text = re.sub(r"\baromali\b|\bmeyveli\b", "", text)
    text = re.sub(r"cam sise|\(|\)|,|\.|-|\||/", " ", text)
    text = re.sub(r"\bgr\b", "g", text)
    text = re.sub(r"\bnanesi\b", "nane", text)
    text = re.sub(r"\bsurubu\b", "surup", text)
    text = re.sub(r"\bfistigi\b|\bfistig\b", "fistik", text)
    text = re.sub(r"\bkabagi\b", "kabak", text)
    text = re.sub(r"\bbalkabagi\b", "balkabak", text)
    text = re.sub(r"\brevize\b", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def extract_amount(title: str) -> tuple[str, float] | None:
    text = str(title).translate(TR).lower()
    match = re.search(r"(\d+(?:[.,]\d+)?)\s*(kg|g|gr|ml|lt|l)\b", text)
    if not match:
        return None
    value = float(match.group(1).replace(",", "."))
    unit = match.group(2)
    if unit == "kg":
        return ("kg", value)
    if unit in ("g", "gr"):
        return ("g", value)
    if unit == "ml":
        return ("ml", value)
    return ("l", value)


def amounts_compatible(catalog_title: str, excel_title: str) -> bool:
    cat_amount = extract_amount(catalog_title)
    excel_amount = extract_amount(excel_title)
    if cat_amount is None or excel_amount is None:
        return True
    return cat_amount == excel_amount


def load_excel(path: Path) -> pd.DataFrame:
    df = pd.read_excel(path, sheet_name="Fiyat Listesi", header=0)
    df.columns = [
        "marka",
        "kategori",
        "resmi_kategori",
        "urun_kodu",
        "urun_adi",
        "fiyat",
    ]
    df = df[df["urun_kodu"].notna() & df["urun_adi"].notna()].copy()
    df["urun_kodu"] = (
        df["urun_kodu"].astype(str).str.replace(".0", "", regex=False).str.strip()
    )
    df["norm"] = df["urun_adi"].apply(normalize_title)
    df["price_num"] = df["fiyat"].apply(parse_price)
    return df


def build_excel_index(df: pd.DataFrame, brands: list[str]) -> tuple[list[str], list[dict]]:
    subset = df[df["marka"].isin(brands)].copy()
    choices = subset["norm"].tolist()
    rows = subset.to_dict("records")
    return choices, rows


def find_best_match(
    title: str,
    choices: list[str],
    rows: list[dict],
    threshold: int,
) -> dict | None:
    query = normalize_title(title)
    result = process.extractOne(query, choices, scorer=fuzz.token_set_ratio)
    if not result:
        return None
    score, index = result[1], result[2]
    if score < threshold:
        return None
    row = rows[index]
    if not amounts_compatible(title, row["urun_adi"]):
        return None
    return row


def create_product_from_excel(row: dict, product_id: int) -> dict:
    brand = row["marka"]
    category = BRAND_TO_CATEGORY.get(brand, brand)
    product_type = str(row["kategori"] or row["resmi_kategori"] or "Ürün").strip()
    title = str(row["urun_adi"]).strip()
    amount = extract_amount(title)
    volume = "-"
    if amount:
        unit, value = amount
        if unit == "g" and value >= 1000:
            volume = f"{value / 1000:g} kg" if value % 1000 == 0 else f"{value:g} g"
        elif unit == "g":
            volume = f"{value:g} g"
        elif unit == "kg":
            volume = f"{value:g} kg"
        elif unit == "ml":
            volume = f"{value:g} ml"
        else:
            volume = f"{value:g} {unit}"

    return {
        "id": product_id,
        "title": title,
        "sku": row["urun_kodu"],
        "category": category,
        "type": product_type,
        "material": str(row["resmi_kategori"] or product_type).strip(),
        "volume": volume,
        "brand": brand if brand in ("Fo", "Repo", "Limpo") else category,
        "printed": False,
        "color": "-",
        "price": format_price(row["price_num"]),
        "image": "",
        "description": "",
        "specifications": {
            "Marka": brand,
            "Tür": product_type,
            "Ürün Kodu": row["urun_kodu"],
            "Kaynak": "Fiyat Listesi",
        },
    }


def main() -> None:
    xlsx_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_XLSX
    if not xlsx_path.exists():
        raise SystemExit(f"Excel file not found: {xlsx_path}")

    df = load_excel(xlsx_path)
    products = json.loads(PRODUCTS_PATH.read_text(encoding="utf-8"))

    unicomix_choices, unicomix_rows = build_excel_index(df, ["Unico Mix"])
    flr_choices, flr_rows = build_excel_index(df, ["Fo", "Repo", "Limpo"])

    matched_excel_codes: set[str] = set()
    updated = 0
    unmatched_catalog: list[str] = []

    for product in products:
        category = product["category"]
        if category == "Unicomix":
            row = find_best_match(
                product["title"],
                unicomix_choices,
                unicomix_rows,
                MATCH_THRESHOLDS["Unicomix"],
            )
        elif category in FLR_CATEGORIES:
            row = find_best_match(
                product["title"],
                flr_choices,
                flr_rows,
                MATCH_THRESHOLDS["flr"],
            )
        else:
            row = None

        if row:
            product["price"] = format_price(row["price_num"])
            matched_excel_codes.add(row["urun_kodu"])
            updated += 1
        elif category in ("Unicomix", *FLR_CATEGORIES):
            unmatched_catalog.append(product["title"])

    next_id = max((p["id"] for p in products), default=0) + 1
    added: list[dict] = []

    limpo_repo = df[df["marka"].isin(["Limpo", "Repo"])].copy()
    existing_flr_titles = [
        normalize_title(p["title"])
        for p in products
        if p["category"] in FLR_CATEGORIES
    ]

    for _, row in limpo_repo.iterrows():
        code = row["urun_kodu"]
        if code in matched_excel_codes:
            continue

        duplicate = process.extractOne(
            row["norm"],
            existing_flr_titles,
            scorer=fuzz.token_set_ratio,
        )
        if duplicate and duplicate[1] >= 90:
            continue

        product = create_product_from_excel(row.to_dict(), next_id)
        products.append(product)
        existing_flr_titles.append(normalize_title(product["title"]))
        matched_excel_codes.add(code)
        added.append(product)
        next_id += 1

    products.sort(
        key=lambda item: (
            item["category"],
            item.get("brand", item["category"]),
            item["title"].lower(),
        )
    )

    PRODUCTS_PATH.write_text(
        json.dumps(products, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Updated prices: {updated}")
    print(f"Added Limpo/Repo products: {len(added)}")
    print(f"Total products: {len(products)}")
    print(f"Unmatched existing catalog items: {len(unmatched_catalog)}")
    if unmatched_catalog[:8]:
        print("Sample unmatched:")
        for title in unmatched_catalog[:8]:
            print(f"  - {title}")

    by_category: dict[str, int] = {}
    for product in products:
        by_category[product["category"]] = by_category.get(product["category"], 0) + 1
    print("By category:", by_category)


if __name__ == "__main__":
    main()
