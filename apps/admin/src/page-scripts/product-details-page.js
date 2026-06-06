import {
  fetchProductRuntimeByIds,
  fetchProductRuntime,
  mergeProductWithRuntime,
  PRODUCT_RUNTIME_TABLE,
  updateProductRuntimeDisplay,
} from "@siggistore/services/admin";
import { fetchSanityProducts } from "@siggistore/services/admin/sanity-service.js";

const SELECTED_PRODUCT_STORAGE_KEY = "admin:selected-product-snapshot";

function safeReadSelectedProductSnapshot() {
  try {
    const raw = localStorage.getItem(SELECTED_PRODUCT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (error) {
    console.warn("Unable to read selected product snapshot", error);
    return null;
  }
}

function buildRuntimeLookupKey(product) {
  return [product.id, product.slug, product.sku]
    .filter(Boolean)
    .map(String);
}

function getProductRouteValue(product) {
  return product?.slug || product?.id || product?.sku || product?.name || "";
}

function normalizeLookupValue(value) {
  return String(value ?? "").trim().toLowerCase();
}

function buildProductLookupKeys(product) {
  return [product?.id, product?.slug, product?.sku, product?.name]
    .filter(Boolean)
    .map(normalizeLookupValue);
}

function findProductIndexByLookupValues(products, lookupValues) {
  const normalizedLookupValues = Array.isArray(lookupValues)
    ? lookupValues.map(normalizeLookupValue).filter(Boolean)
    : [normalizeLookupValue(lookupValues)].filter(Boolean);

  if (!normalizedLookupValues.length) return -1;

  return products.findIndex((product) =>
    buildProductLookupKeys(product).some((key) => normalizedLookupValues.includes(key)),
  );
}

function buildRuntimeLookupIds(productLookupValues = [], snapshotProduct = null) {
  const values = new Set();

  (Array.isArray(productLookupValues) ? productLookupValues : [productLookupValues])
    .filter(Boolean)
    .forEach((value) => values.add(String(value).trim()));

  if (snapshotProduct) {
    buildProductLookupKeys(snapshotProduct).forEach((value) => values.add(String(value).trim()));
  }

  return [...values].filter(Boolean);
}

function buildRuntimeProductFromRow(runtimeRow, snapshotProduct = null) {
  if (!runtimeRow) return null;

  const meta = Array.isArray(runtimeRow.channels)
    ? runtimeRow.channels
        .map((channel) => String(channel))
        .find((channel) => channel.startsWith("__display_meta:"))
    : null;

  let displayMeta = null;
  if (meta) {
    try {
      displayMeta = JSON.parse(decodeURIComponent(meta.slice("__display_meta:".length)));
    } catch {
      displayMeta = null;
    }
  }

  const runtimeVariants = Array.isArray(runtimeRow.display_variants) ? runtimeRow.display_variants : [];
  return mergeProductWithRuntime(
    {
      id: runtimeRow.sanity_product_id || runtimeRow.product_id || runtimeRow.slug || runtimeRow.sku || snapshotProduct?.id || snapshotProduct?.slug || "product",
      slug: runtimeRow.slug || snapshotProduct?.slug || runtimeRow.sanity_product_id || runtimeRow.product_id || "product",
      sku: runtimeRow.sku || snapshotProduct?.sku || "",
      name: snapshotProduct?.name || snapshotProduct?.title || runtimeRow.display_name || runtimeRow.slug || runtimeRow.sku || "Produit",
      category: displayMeta?.category || snapshotProduct?.category || "Sans categorie",
      price: snapshotProduct?.price ?? runtimeRow.price ?? 0,
      stock: runtimeRow.stock ?? snapshotProduct?.stock ?? 0,
      isAvailable: runtimeRow.is_available ?? snapshotProduct?.isAvailable ?? true,
      channels: Array.isArray(runtimeRow.channels) ? runtimeRow.channels : [],
      displayVariants: runtimeVariants,
      displayCategory: displayMeta?.category || snapshotProduct?.displayCategory || snapshotProduct?.category || "Sans categorie",
      runtime: runtimeRow,
    },
    runtimeRow,
  );
}

function findProductIndex(products, lookupValue) {
  if (!lookupValue) return -1;

  return products.findIndex((product) => {
    return (
      String(product.slug) === lookupValue ||
      String(product.id) === lookupValue ||
      String(product.sku) === lookupValue
    );
  });
}

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
  } else {
    select.value = existing.value || normalizedValue;
  }
}

function getProductRuntimeErrorMessage(error, fallback) {
  const message = String(error?.message || "");
  if (/products_runtime|schema cache|relation .* does not exist/i.test(message)) {
    return "La table products_runtime est manquante. Executez scripts/create-products-runtime-table.sql dans Supabase, puis reessayez.";
  }
  return message ? `${fallback}: ${message}` : `${fallback}.`;
}

function getStoredDisplayEdit(product) {
  if (!product) return null;

  return {
    category: product.displayCategory || product.category,
    isAvailable: product.isAvailable,
    tags: Array.isArray(product.channels) ? product.channels : [],
    variants: Array.isArray(product.displayVariants) ? product.displayVariants : [],
    stock: product.stock,
  };
}

function getVariantStock(variants) {
  return (Array.isArray(variants) ? variants : []).reduce((sum, variant) => {
    return sum + Math.max(0, Number(variant.quantity || 0) || 0);
  }, 0);
}

function syncAvailabilityFromVariants() {
  const availabilityInput = document.getElementById("hs-pro-epdas");
  if (!availabilityInput) return;

  availabilityInput.checked = getVariantStock(collectProductVariants()) > 0;
}

function collectProductVariants() {
  const wrapper = document.getElementById("hs-wrapper-for-copy");
  if (!wrapper) return [];

  return Array.from(wrapper.children)
    .filter((row) => !row.classList.contains("hidden") && !row.classList.contains("[--ignore-for-count]"))
    .map((row) => {
      const sizeInput = row.querySelector('input[id^="hs-pro-epdvts"]');
      const colorInput = row.querySelector('input[id^="hs-pro-epdvtc"]');
      const quantityInput = row.querySelector('input[id^="hs-pro-epdvtq"]');
      const size = sizeInput?.value?.trim() || "";
      const color = colorInput?.value?.trim() || "";
      const quantity = Math.max(0, Number(quantityInput?.value || 0) || 0);

      return {
        size,
        color,
        quantity,
      };
    })
    .filter((variant) => variant.size && variant.color);
}

function getVariantRows() {
  const wrapper = document.getElementById("hs-wrapper-for-copy");
  if (!wrapper) return [];

  return Array.from(wrapper.children).filter(
    (row) => !row.classList.contains("hidden") && !row.classList.contains("[--ignore-for-count]"),
  );
}

function syncVariantDeleteButtonState() {
  const rows = getVariantRows();
  const deleteButtons = Array.from(
    document.querySelectorAll("#hs-wrapper-for-copy [data-hs-copy-markup-delete-item]"),
  );
  const shouldDisable = rows.length <= 1;

  deleteButtons.forEach((button) => {
    if (shouldDisable) {
      button.setAttribute("disabled", "disabled");
      button.classList.add("disabled");
    } else {
      button.removeAttribute("disabled");
      button.classList.remove("disabled");
    }
  });
}

function bindVariantDeleteFallback() {
  const wrapper = document.getElementById("hs-wrapper-for-copy");
  if (!wrapper || wrapper.dataset.variantDeleteFallbackBound === "true") return;

  wrapper.dataset.variantDeleteFallbackBound = "true";
  wrapper.addEventListener("click", (event) => {
    const button = event.target.closest("[data-hs-copy-markup-delete-item]");
    if (!button || !wrapper.contains(button)) return;

    const row = button.closest(".p0vwr");
    const rows = getVariantRows();
    if (!row || rows.length <= 1) {
      syncVariantDeleteButtonState();
      return;
    }

    event.preventDefault();
    row.remove();
    syncAvailabilityFromVariants();
    syncVariantDeleteButtonState();
  });
}

function applyStoredDisplayEdit(product, edit) {
  if (!edit) return;

  const availabilityInput = document.getElementById("hs-pro-epdas");
  const categorySelect = document.getElementById("product-details-category");
  const tagsInput = document.getElementById("hs-pro-dauftg");

  if (availabilityInput && typeof edit.isAvailable === "boolean") {
    availabilityInput.checked = edit.isAvailable;
  }

  updateSelectValue(categorySelect, edit.category || product.category || "Sans categorie");

  if (tagsInput && Array.isArray(edit.tags)) {
    tagsInput.value = edit.tags.join(", ");
  }

  if (Array.isArray(edit.variants) && edit.variants.length) {
    const wrapper = document.getElementById("hs-wrapper-for-copy");
    const template = document.getElementById("hs-content-for-copy");
    if (wrapper) {
      let rows = Array.from(wrapper.children).filter(
        (row) => !row.classList.contains("hidden") && !row.classList.contains("[--ignore-for-count]"),
      );

      while (rows.length < edit.variants.length) {
        const source = rows[0] || template;
        if (!source) break;
        const clone = source.cloneNode(true);
        clone.classList.remove("hidden", "[--ignore-for-count]");
        wrapper.appendChild(clone);
        rows = Array.from(wrapper.children).filter(
          (row) => !row.classList.contains("hidden") && !row.classList.contains("[--ignore-for-count]"),
        );
      }

      rows.forEach((row, index) => {
        const variant = edit.variants[index];
        if (!variant) {
          row.classList.add("hidden");
          return;
        }

        row.classList.remove("hidden");
        const sizeInput = row.querySelector('input[id^="hs-pro-epdvts"]');
        const colorInput = row.querySelector('input[id^="hs-pro-epdvtc"]');
        const quantityInput = row.querySelector('input[id^="hs-pro-epdvtq"]');
        if (sizeInput) sizeInput.value = variant.size || "Taille unique";
        if (colorInput) colorInput.value = variant.color || "Par defaut";
        if (quantityInput) quantityInput.value = String(Math.max(0, Number(variant.quantity || 0) || 0));
      });
    }
  }

  syncAvailabilityFromVariants();
  syncVariantDeleteButtonState();
}

function renderProductDetailsView(currentProduct, mergedProducts, currentIndex) {
  if (!currentProduct) return;

  const titleNode = document.getElementById("product-details-title");
  const breadcrumbLink = document.getElementById("product-details-breadcrumb-link");
  const prevButton = document.getElementById("product-details-prev");
  const nextButton = document.getElementById("product-details-next");
  const availabilityInput = document.getElementById("hs-pro-epdas");
  const categorySelect = document.getElementById("product-details-category");
  const tagsInput = document.getElementById("hs-pro-dauftg");

  const storedDisplayEdit = getStoredDisplayEdit(currentProduct);

  if (titleNode) titleNode.textContent = currentProduct.name;
  if (breadcrumbLink) {
    breadcrumbLink.textContent = currentProduct.name;
    breadcrumbLink.href = `./product-details.html?product=${encodeURIComponent(getProductRouteValue(currentProduct))}`;
  }
  document.title = `${currentProduct.name} | Product Details`;

  if (availabilityInput) {
    availabilityInput.checked =
      typeof storedDisplayEdit?.isAvailable === "boolean"
        ? storedDisplayEdit.isAvailable
        : Boolean(currentProduct.isAvailable);
  }

  updateSelectValue(categorySelect, storedDisplayEdit?.category || currentProduct.category || "Sans categorie");

  if (tagsInput) {
    const channels = Array.isArray(storedDisplayEdit?.tags)
      ? storedDisplayEdit.tags
      : Array.isArray(currentProduct.channels)
        ? currentProduct.channels
        : [];
    tagsInput.value = channels.join(", ");
  }

  const colorInputs = Array.from(document.querySelectorAll('input[id^="hs-pro-epdvtc"]'));
  colorInputs.forEach((input) => {
    if (!input.value) input.value = currentProduct.category || "Par defaut";
  });

  applyStoredDisplayEdit(currentProduct, storedDisplayEdit);
  syncAvailabilityFromVariants();
  bindVariantAvailabilitySync();
  bindVariantDeleteFallback();
  bindDisplayEditSave(currentProduct);
  bindFooterNavigationActions();

  if (Array.isArray(mergedProducts) && mergedProducts.length) {
    wireNavigation(prevButton, mergedProducts[currentIndex - 1] || null);
    wireNavigation(nextButton, mergedProducts[currentIndex + 1] || null);
  }

  syncVariantDeleteButtonState();
  window.HSStaticMethods?.autoInit?.();
}

function bindDisplayEditSave(product) {
  const saveLink =
    document.querySelector('[data-product-details-save-action="true"]') ||
    Array.from(document.querySelectorAll("a")).find((link) =>
      ["save changes", "enregistrer les modifications"].includes(link.textContent.trim().toLowerCase()),
    );
  if (!saveLink || saveLink.dataset.productDisplaySaveBound === "true") return;

  saveLink.dataset.productDisplaySaveBound = "true";
  saveLink.addEventListener("click", async (event) => {
    event.preventDefault();

    const availabilityInput = document.getElementById("hs-pro-epdas");
    const categorySelect = document.getElementById("product-details-category");
    const tagsInput = document.getElementById("hs-pro-dauftg");
    const variants = collectProductVariants();
    const stock = getVariantStock(variants);
    const isAvailable = stock > 0;
    const tags = String(tagsInput?.value || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (availabilityInput) {
      availabilityInput.checked = isAvailable;
    }

    const display = {
      category: categorySelect?.value || product.category || "Sans categorie",
      isAvailable,
      tags,
      variants,
      stock,
    };

    const originalText = saveLink.textContent;
    saveLink.textContent = "Enregistrement...";
    saveLink.style.pointerEvents = "none";

    try {
      const runtime = await updateProductRuntimeDisplay(product, display, {
        table: PRODUCT_RUNTIME_TABLE,
      });
      Object.assign(product, mergeProductWithRuntime(product, runtime));
      saveLink.textContent = "Enregistre";
    } catch (error) {
      console.error("Failed to save product display controls", error);
      saveLink.textContent = "Configuration requise";
      saveLink.title = getProductRuntimeErrorMessage(error, "Echec de l'enregistrement");
    } finally {
      window.setTimeout(() => {
        saveLink.textContent = originalText || "Enregistrer les modifications";
        saveLink.removeAttribute("title");
        saveLink.style.pointerEvents = "";
      }, 1200);
    }
  });
}

function bindFooterNavigationActions() {
  const cancelLink = document.querySelector('[data-product-details-cancel-action="true"]');
  if (cancelLink && cancelLink.dataset.productDetailsCancelBound !== "true") {
    cancelLink.dataset.productDetailsCancelBound = "true";
    cancelLink.addEventListener("click", (event) => {
      event.preventDefault();
      window.history.back();
    });
  }

  const closeButton = document.querySelector('[data-product-details-close-action="true"]');
  if (closeButton && closeButton.dataset.productDetailsCloseBound !== "true") {
    closeButton.dataset.productDetailsCloseBound = "true";
    closeButton.addEventListener("click", () => {
      window.history.back();
    });
  }
}

function bindVariantAvailabilitySync() {
  const wrapper = document.getElementById("hs-wrapper-for-copy");
  if (!wrapper || wrapper.dataset.variantAvailabilitySyncBound === "true") return;

  wrapper.dataset.variantAvailabilitySyncBound = "true";
  wrapper.addEventListener("input", syncAvailabilityFromVariants);
  wrapper.addEventListener("click", () => {
    window.setTimeout(syncAvailabilityFromVariants, 0);
  });
}

function wireNavigation(button, product) {
  if (!button) return;

  if (button.dataset.productDetailsNavigationBound === "true") {
    button.disabled = !product;
    return;
  }

  button.dataset.productDetailsNavigationBound = "true";

  if (!product) {
    button.disabled = true;
    return;
  }

  button.disabled = false;
  button.addEventListener("click", () => {
    const target = `./product-details.html?product=${encodeURIComponent(getProductRouteValue(product))}`;
    window.location.href = target;
  });
}

async function initProductDetailsPage() {
  const params = new URLSearchParams(window.location.search);
  const productLookupValues = [params.get("product"), params.get("slug"), params.get("id"), params.get("sku")]
    .filter(Boolean)
    .map(normalizeLookupValue);
  const snapshotProduct = safeReadSelectedProductSnapshot();
  const titleNode = document.getElementById("product-details-title");
  const breadcrumbLink = document.getElementById("product-details-breadcrumb-link");
  const prevButton = document.getElementById("product-details-prev");
  const nextButton = document.getElementById("product-details-next");

  if (!titleNode || !breadcrumbLink || !prevButton || !nextButton) return;

  if (snapshotProduct) {
    renderProductDetailsView(snapshotProduct, [], 0);
  }

  try {
    let mergedProducts = [];
    let currentProduct = snapshotProduct;
    let currentIndex = -1;
    let runtimeFallbackProduct = null;

    const runtimeLookupIds = buildRuntimeLookupIds(productLookupValues, snapshotProduct);
    let runtimeFallbackRow = null;
    try {
      const runtimeRows = await fetchProductRuntime({
        table: PRODUCT_RUNTIME_TABLE,
        ids: runtimeLookupIds,
        query: runtimeLookupIds[0] || "",
        limit: 20,
      });

      runtimeFallbackRow =
        runtimeRows.find((runtime) =>
          runtimeLookupIds.some((lookup) =>
            [runtime.sanity_product_id, runtime.product_id, runtime.slug, runtime.sku]
              .filter(Boolean)
              .some((value) => normalizeLookupValue(value) === normalizeLookupValue(lookup)),
          ),
        ) || runtimeRows[0] || null;
    } catch (runtimeError) {
      console.warn("Supabase runtime direct lookup unavailable for product details page", runtimeError);
    }

    try {
      const products = await fetchSanityProducts({ limit: 100 });
      const runtimeIds = [...new Set([
        ...runtimeLookupIds,
        ...products.flatMap((product) => buildRuntimeLookupKey(product)),
      ])];

      let runtimeRows = [];
      try {
        runtimeRows = await fetchProductRuntimeByIds(runtimeIds, {
          table: PRODUCT_RUNTIME_TABLE,
        });
      } catch (runtimeError) {
        console.warn("Supabase runtime unavailable for product details page", runtimeError);
      }

      const runtimeMap = new Map();
      runtimeRows.forEach((runtime) => {
        [runtime.sanity_product_id, runtime.product_id, runtime.slug, runtime.sku]
          .filter(Boolean)
          .forEach((key) => {
            runtimeMap.set(String(key), runtime);
          });
      });

      mergedProducts = products.map((product) => {
        const runtime = buildRuntimeLookupKey(product)
          .map((key) => runtimeMap.get(String(key)))
          .find(Boolean);
        return mergeProductWithRuntime(product, runtime);
      });

      const matchedIndex = findProductIndexByLookupValues(mergedProducts, productLookupValues);
      const snapshotIndex = snapshotProduct
        ? findProductIndexByLookupValues(mergedProducts, buildProductLookupKeys(snapshotProduct))
        : -1;

      if (matchedIndex >= 0) {
        currentProduct = mergedProducts[matchedIndex];
        currentIndex = matchedIndex;
      } else if (snapshotIndex >= 0) {
        currentProduct = mergedProducts[snapshotIndex];
        currentIndex = snapshotIndex;
      } else if (snapshotProduct) {
        currentProduct = snapshotProduct;
        currentIndex = 0;
      } else {
        runtimeFallbackProduct = runtimeFallbackRow ? buildRuntimeProductFromRow(runtimeFallbackRow, snapshotProduct) : null;
        currentProduct = runtimeFallbackProduct || mergedProducts[0] || null;
        currentIndex = 0;
      }
    } catch (fetchError) {
      console.warn("Unable to load live product details, falling back to selected snapshot", fetchError);
      runtimeFallbackProduct = runtimeFallbackRow ? buildRuntimeProductFromRow(runtimeFallbackRow, snapshotProduct) : null;
      mergedProducts = runtimeFallbackProduct
        ? [runtimeFallbackProduct]
        : snapshotProduct
          ? [snapshotProduct]
          : [];
      currentProduct = runtimeFallbackProduct || snapshotProduct || null;
      currentIndex = 0;
    }

    if (!currentProduct) return;
    renderProductDetailsView(currentProduct, mergedProducts, currentIndex);
  } catch (error) {
    console.error("Failed to load product details", error);
  }
}

initProductDetailsPage();
