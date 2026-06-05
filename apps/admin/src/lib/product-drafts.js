const STORAGE_KEY = "admin:product-drafts";

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function normalizeTags(value) {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }

  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeVariants(variants) {
  return (Array.isArray(variants) ? variants : [])
    .map((variant) => {
      const size = String(variant?.size || "").trim();
      const color = String(variant?.color || "").trim();
      const quantity = Math.max(
        0,
        Number(variant?.quantity ?? variant?.stock ?? variant?.inventory ?? 0) || 0,
      );
      const price = Number(variant?.price ?? variant?.amount ?? 0) || 0;

      return {
        size,
        color,
        price,
        quantity,
      };
    })
    .filter((variant) => variant.size || variant.color || variant.quantity > 0 || variant.price > 0);
}

function getVariantStock(variants) {
  return normalizeVariants(variants).reduce((sum, variant) => sum + variant.quantity, 0);
}

function getStorage() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return window.localStorage;
}

function readStoredDraftsRaw() {
  const storage = getStorage();
  if (!storage) return [];

  const parsed = safeParse(storage.getItem(STORAGE_KEY) || "[]", []);
  return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
}

function writeStoredDraftsRaw(drafts) {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

function buildDraftKeys(entry) {
  return [entry?.draftId, entry?.id, entry?.slug, entry?.sku]
    .filter(Boolean)
    .map((value) => String(value));
}

function normalizeStoredDraft(entry = {}) {
  const variants = normalizeVariants(entry.variants || entry.displayVariants || []);
  const tags = normalizeTags(entry.tags || entry.channels || []);
  const category = String(entry.category || entry.displayCategory || "Sans categorie").trim() || "Sans categorie";
  const rawName = String(entry.name || entry.title || "").trim();
  const rawSku = String(entry.sku || "").trim();
  const draftId =
    String(entry.draftId || entry.id || "").trim() ||
    `draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const slug = String(entry.slug || slugify(rawName || rawSku || draftId || "product")).trim() || draftId;
  const priceFromVariants = variants.find((variant) => Number.isFinite(variant.price) && variant.price > 0)?.price || 0;
  const stock = Number(entry.stock ?? getVariantStock(variants)) || 0;
  const price = Number(entry.price ?? priceFromVariants) || 0;
  const runtimeId = entry.runtimeId || entry.runtime?.id || null;
  const runtime = runtimeId ? { id: runtimeId } : null;

  return {
    draftId,
    id: draftId,
    name: rawName || "Nouveau produit",
    title: rawName || "Nouveau produit",
    slug,
    sku: rawSku,
    weight: String(entry.weight || "").trim(),
    price,
    compareAtPrice: entry.compareAtPrice == null ? null : Number(entry.compareAtPrice) || 0,
    stock,
    isAvailable:
      typeof entry.isAvailable === "boolean"
        ? entry.isAvailable
        : stock > 0,
    category,
    tags,
    channels: tags,
    variants,
    displayVariants: variants,
    displayCategory: category,
    description: String(entry.description || "").trim(),
    imageUrl: entry.imageUrl || null,
    featured: Boolean(entry.featured),
    runtimeId,
    runtime,
    updatedAt: String(entry.updatedAt || entry.updated_at || new Date().toISOString()),
  };
}

export function loadStoredProductDrafts() {
  return readStoredDraftsRaw()
    .map(normalizeStoredDraft)
    .sort((left, right) => String(right.updatedAt || "").localeCompare(String(left.updatedAt || "")));
}

export function findStoredProductDraft(productKey) {
  const lookup = String(productKey || "").trim();
  if (!lookup) return null;

  return loadStoredProductDrafts().find((draft) => {
    return [draft.draftId, draft.id, draft.slug, draft.sku]
      .filter(Boolean)
      .some((value) => String(value) === lookup);
  }) || null;
}

export function upsertStoredProductDraft(input = {}) {
  const nextDraft = normalizeStoredDraft({
    ...input,
    updatedAt: new Date().toISOString(),
  });
  const nextKeys = new Set(buildDraftKeys(nextDraft));
  const storedDrafts = readStoredDraftsRaw().filter((entry) => {
    const entryKeys = buildDraftKeys(entry);
    return !entryKeys.some((key) => nextKeys.has(key));
  });

  storedDrafts.unshift(nextDraft);
  writeStoredDraftsRaw(storedDrafts);
  return nextDraft;
}

export function mergeProductsWithStoredDrafts(products = [], drafts = loadStoredProductDrafts()) {
  const merged = [...products];

  drafts.forEach((draft) => {
    const index = merged.findIndex((product) => {
      return [product?.id, product?.slug, product?.sku]
        .filter(Boolean)
        .some((value) => [draft.draftId, draft.id, draft.slug, draft.sku]
          .filter(Boolean)
          .includes(String(value)));
    });

    if (index >= 0) {
      merged[index] = {
        ...merged[index],
        ...draft,
        runtime: draft.runtime || merged[index].runtime || null,
      };
      return;
    }

    merged.unshift(draft);
  });

  return merged;
}

export function buildProductDraftFromForm(form = {}) {
  const variants = normalizeVariants(form.variants);
  const priceFromVariants = variants.find((variant) => Number.isFinite(variant.price) && variant.price > 0)?.price || 0;
  const stock = Number(form.stock ?? getVariantStock(variants)) || 0;
  const tags = normalizeTags(form.tags);
  const category = String(form.category || "Sans categorie").trim() || "Sans categorie";
  const name = String(form.name || "").trim() || "Nouveau produit";
  const sku = String(form.sku || "").trim();
  const draftId = String(form.draftId || "").trim() || `draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const slug = String(form.slug || slugify(name || sku || draftId || "product")).trim() || draftId;

  return {
    draftId,
    id: draftId,
    name,
    title: name,
    slug,
    sku,
    weight: String(form.weight || "").trim(),
    price: Number(form.price ?? priceFromVariants) || 0,
    compareAtPrice: form.compareAtPrice == null ? null : Number(form.compareAtPrice) || 0,
    stock,
    isAvailable:
      typeof form.isAvailable === "boolean"
        ? form.isAvailable
        : stock > 0,
    category,
    tags,
    channels: tags,
    variants,
    displayVariants: variants,
    displayCategory: category,
    description: String(form.description || "").trim(),
    imageUrl: form.imageUrl || null,
    featured: Boolean(form.featured),
    runtimeId: form.runtimeId || form.runtime?.id || null,
    runtime: form.runtime?.id || form.runtimeId ? { id: form.runtime?.id || form.runtimeId } : null,
  };
}
