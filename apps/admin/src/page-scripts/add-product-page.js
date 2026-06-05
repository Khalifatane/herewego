import {
  fetchProductRuntimeByIds,
  mergeProductWithRuntime,
  PRODUCT_RUNTIME_TABLE,
  updateProductRuntimeDisplay,
} from "@siggistore/services/admin";
import {
  buildProductDraftFromForm,
  loadStoredProductDrafts,
  upsertStoredProductDraft,
} from "../lib/product-drafts.js";

let activeDraft = null;

function updateSelectValue(select, value) {
  if (!select || !value) return;

  const normalizedValue = String(value);
  const options = Array.from(select.options);
  const existing = options.find((option) => option.value === normalizedValue || option.text === normalizedValue);

  if (!existing) {
    const option = document.createElement("option");
    option.value = normalizedValue;
    option.text = normalizedValue;
    select.appendChild(option);
    select.value = normalizedValue;
    return;
  }

  select.value = existing.value || normalizedValue;
}

function getVariantRows() {
  const wrapper = document.getElementById("hs-wrapper-for-copy");
  if (!wrapper) return [];

  return Array.from(wrapper.children).filter(
    (row) => !row.classList.contains("hidden") && !row.classList.contains("[--ignore-for-count]"),
  );
}

function ensureVariantRows(count) {
  const wrapper = document.getElementById("hs-wrapper-for-copy");
  const template = document.getElementById("hs-content-for-copy");
  if (!wrapper) return [];

  let rows = getVariantRows();

  while (rows.length < count) {
    const source = rows[0] || template;
    if (!source) break;

    const clone = source.cloneNode(true);
    clone.classList.remove("hidden", "[--ignore-for-count]");
    wrapper.appendChild(clone);
    rows = getVariantRows();
  }

  return rows;
}

function collectProductVariants() {
  return getVariantRows()
    .map((row) => {
      const sizeInput = row.querySelector('input[id^="hs-pro-epdvts"]');
      const colorInput = row.querySelector('input[id^="hs-pro-epdvtc"]');
      const priceInput = row.querySelector('input[id^="hs-pro-epdvtp"]');
      const quantityInput = row.querySelector('input[id^="hs-pro-epdvtq"]');

      const size = sizeInput?.value?.trim() || "";
      const color = colorInput?.value?.trim() || "";
      const price = Math.max(0, Number(priceInput?.value || 0) || 0);
      const quantity = Math.max(0, Number(quantityInput?.value || 0) || 0);

      return {
        size,
        color,
        price,
        quantity,
      };
    })
    .filter((variant) => variant.size || variant.color || variant.price > 0 || variant.quantity > 0);
}

function collectDraftFromForm(existingDraft = null) {
  const nameInput = document.getElementById("hs-pro-eapnm");
  const skuInput = document.getElementById("hs-pro-eapsku");
  const weightInput = document.getElementById("hs-pro-eapwe");
  const availabilityInput = document.getElementById("hs-pro-epdas");
  const tagsInput = document.getElementById("hs-pro-dauftg");
  const categorySelect = document.querySelector("#hs-add-product-organization-card-body select");
  const editor = document.getElementById("hs-editor-tiptap");
  const variants = collectProductVariants();
  const firstVariantPrice = variants.find((variant) => Number(variant.price) > 0)?.price || 0;

  return buildProductDraftFromForm({
    draftId: existingDraft?.draftId,
    runtimeId: existingDraft?.runtimeId,
    name: nameInput?.value || existingDraft?.name || "",
    sku: skuInput?.value || existingDraft?.sku || "",
    weight: weightInput?.value || existingDraft?.weight || "",
    price: existingDraft?.price || firstVariantPrice,
    category: categorySelect?.value || existingDraft?.category || "Sans categorie",
    tags: tagsInput?.value || existingDraft?.tags || [],
    isAvailable:
      typeof availabilityInput?.checked === "boolean"
        ? availabilityInput.checked
        : existingDraft?.isAvailable,
    variants,
    description: editor?.innerHTML || existingDraft?.description || "",
    imageUrl: existingDraft?.imageUrl || null,
    featured: existingDraft?.featured || false,
  });
}

function applyDraftToForm(draft) {
  if (!draft) return;

  const nameInput = document.getElementById("hs-pro-eapnm");
  const skuInput = document.getElementById("hs-pro-eapsku");
  const weightInput = document.getElementById("hs-pro-eapwe");
  const availabilityInput = document.getElementById("hs-pro-epdas");
  const tagsInput = document.getElementById("hs-pro-dauftg");
  const categorySelect = document.querySelector("#hs-add-product-organization-card-body select");
  const editor = document.getElementById("hs-editor-tiptap");

  if (nameInput && draft.name) nameInput.value = draft.name;
  if (skuInput && draft.sku) skuInput.value = draft.sku;
  if (weightInput && draft.weight) weightInput.value = draft.weight;
  if (availabilityInput && typeof draft.isAvailable === "boolean") {
    availabilityInput.checked = draft.isAvailable;
  }
  if (tagsInput && Array.isArray(draft.tags)) {
    tagsInput.value = draft.tags.join(", ");
  }
  if (editor && draft.description) {
    editor.innerHTML = draft.description;
  }

  updateSelectValue(categorySelect, draft.category || "Sans categorie");

  const variantCount = Array.isArray(draft.displayVariants) ? draft.displayVariants.length : 0;
  if (!variantCount) return;

  const rows = ensureVariantRows(variantCount);
  rows.forEach((row, index) => {
    const variant = draft.displayVariants?.[index];
    if (!variant) {
      row.classList.add("hidden");
      return;
    }

    row.classList.remove("hidden");

    const sizeInput = row.querySelector('input[id^="hs-pro-epdvts"]');
    const colorInput = row.querySelector('input[id^="hs-pro-epdvtc"]');
    const priceInput = row.querySelector('input[id^="hs-pro-epdvtp"]');
    const quantityInput = row.querySelector('input[id^="hs-pro-epdvtq"]');

    if (sizeInput) sizeInput.value = variant.size || "";
    if (colorInput) colorInput.value = variant.color || "";
    if (priceInput && variant.price != null) priceInput.value = String(variant.price);
    if (quantityInput) quantityInput.value = String(Math.max(0, Number(variant.quantity || 0) || 0));
  });
}

async function resolveExistingRuntime(draft) {
  const lookupIds = [draft?.draftId, draft?.id, draft?.slug, draft?.sku].filter(Boolean);
  if (!lookupIds.length) return null;

  try {
    const runtimeRows = await fetchProductRuntimeByIds([...new Set(lookupIds)], {
      table: PRODUCT_RUNTIME_TABLE,
    });
    return runtimeRows[0] || null;
  } catch (error) {
    console.warn("Supabase runtime unavailable for add product page", error);
    return null;
  }
}

function bindDraftAutosave() {
  if (document.documentElement.dataset.addProductAutosaveBound === "true") return;
  document.documentElement.dataset.addProductAutosaveBound = "true";

  let timer = null;
  const persist = () => {
    const draft = collectDraftFromForm(activeDraft);
    activeDraft = upsertStoredProductDraft(draft);
  };

  const schedulePersist = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(persist, 250);
  };

  document.addEventListener("input", (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    if (!event.target.closest("#hs-product-details-pricing-card-body, #hs-add-product-organization-card-body, #hs-wrapper-for-copy, #hs-editor-tiptap")) return;
    schedulePersist();
  });

  document.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    if (!event.target.closest("#hs-product-details-pricing-card-body, #hs-add-product-organization-card-body, #hs-wrapper-for-copy")) return;
    schedulePersist();
  });
}

function bindSaveLink() {
  const saveLink = Array.from(document.querySelectorAll("a")).find((link) =>
    ["save changes", "enregistrer les modifications"].includes(link.textContent.trim().toLowerCase()),
  );

  if (!saveLink || saveLink.dataset.addProductSaveBound === "true") return;

  saveLink.dataset.addProductSaveBound = "true";
  saveLink.addEventListener("click", async (event) => {
    event.preventDefault();

    const existingDraft = activeDraft || loadStoredProductDrafts()[0] || null;
    const draft = collectDraftFromForm(activeDraft || existingDraft);

    if (!draft.name || draft.name === "Nouveau produit") {
      const originalText = saveLink.textContent;
      saveLink.title = "Le nom du produit est requis";
      saveLink.textContent = "Nom requis";
      window.setTimeout(() => {
        saveLink.textContent = originalText || "Save changes";
        saveLink.removeAttribute("title");
      }, 1200);
      return;
    }

    const originalText = saveLink.textContent;
    saveLink.textContent = "Enregistrement...";
    saveLink.style.pointerEvents = "none";

    try {
      const existingRuntime = await resolveExistingRuntime(draft);
      const runtimeSeed = existingRuntime ? { ...draft, runtime: existingRuntime } : draft;
      const runtime = await updateProductRuntimeDisplay(runtimeSeed, {
        category: draft.category,
        isAvailable: draft.isAvailable,
        tags: draft.tags,
        variants: draft.displayVariants,
        stock: draft.stock,
      }, {
        table: PRODUCT_RUNTIME_TABLE,
      });

      const savedDraft = upsertStoredProductDraft({
        ...draft,
        runtimeId: runtime?.id || existingRuntime?.id || draft.runtimeId || null,
        updatedAt: runtime?.updated_at || new Date().toISOString(),
      });
      activeDraft = savedDraft;

      saveLink.textContent = "Enregistre";
      saveLink.title = `Produit sauvegarde: ${savedDraft.name}`;
      window.HSStaticMethods?.autoInit?.();
    } catch (error) {
      console.error("Failed to save add product draft", error);
      saveLink.textContent = "Configuration requise";
      saveLink.title = String(error?.message || "Echec de l'enregistrement");
    } finally {
      window.setTimeout(() => {
        saveLink.textContent = originalText || "Save changes";
        saveLink.style.pointerEvents = "";
      }, 1200);
    }
  });
}

function initAddProductPage() {
  activeDraft = loadStoredProductDrafts()[0] || null;
  if (activeDraft) {
    applyDraftToForm(activeDraft);
  }

  bindDraftAutosave();
  bindSaveLink();
  window.HSStaticMethods?.autoInit?.();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAddProductPage, { once: true });
} else {
  initAddProductPage();
}
