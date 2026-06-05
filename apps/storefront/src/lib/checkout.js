import { getCart, getCartSubtotal, getAppliedDiscount, getDiscountAmount } from "./store.js";

export const CHECKOUT_DRAFT_KEY = "appCheckoutDraft";
export const LAST_CHECKOUT_DETAILS_KEY = "appLastCheckoutDetails";
export const REVIEW_SNAPSHOT_KEY = "appReviewOrderSnapshot";
export const LATEST_ORDER_KEY = "appLatestOrder";
export const ORDERS_KEY = "appOrders";

function safeReadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("Unable to read checkout storage key.", key, error);
    return fallback;
  }
}

function safeWriteJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadCheckoutDraft() {
  return safeReadJson(CHECKOUT_DRAFT_KEY, null) || safeReadJson(LAST_CHECKOUT_DETAILS_KEY, null);
}

export function loadLatestOrder() {
  return safeReadJson(LATEST_ORDER_KEY, null);
}

export function buildShippingAddressFromDraft(draft) {
  if (!draft) return null;

  const fullName = String(draft.fullName || "").trim();
  const nameParts = fullName ? fullName.split(/\s+/) : [];

  return {
    first_name: draft.firstName || nameParts[0] || "",
    last_name: draft.lastName || nameParts.slice(1).join(" "),
    email: draft.email || "",
    phone: draft.phone || "",
    address_line_1: draft.address1 || "",
    address_line_2: draft.address2 || "",
    city: draft.city || "",
    state: draft.state || "",
    postal_code: draft.postalCode || draft.zipCode || "",
    country: draft.country || "",
  };
}

export function createCheckoutDraft(formData, extra = {}) {
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const address1 = String(formData.get("address1") || "").trim();
  const address2 = String(formData.get("address2") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const state = String(formData.get("state") || "").trim();
  const postalCode = String(formData.get("postalCode") || formData.get("zipCode") || "").trim();
  const country = String(formData.get("country") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const shippingMethod = String(formData.get("shipping") || formData.get("shippingMethod") || extra.shippingMethod || "standard");
  const paymentMethod = String(formData.get("payment") || extra.paymentMethod || "Card");
  const promoCode = String(formData.get("promoCode") || extra.promoCode || "").trim();
  const items = Array.isArray(extra.items) ? extra.items : getCart();
  const subtotal = Number(extra.subtotal ?? getCartSubtotal(items));
  const discount = getAppliedDiscount();
  const promoDiscount = promoCode ? getDiscountAmount(subtotal, discount) : getDiscountAmount(subtotal, discount);
  const shippingAmount = Number(extra.shippingAmount ?? (shippingMethod === "express" ? 1500 : 0));
  const estimatedTax = Number(extra.estimatedTax ?? 0);
  const saleDiscount = Number(extra.saleDiscount ?? 0);
  const total = Math.max(0, subtotal + shippingAmount + estimatedTax - promoDiscount - saleDiscount);

  return {
    email,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
    address1,
    address2,
    city,
    state,
    postalCode,
    country,
    phone,
    shippingMethod,
    paymentMethod,
    promoCode,
    items,
    subtotal,
    shippingAmount,
    estimatedTax,
    saleDiscount,
    promoDiscount,
    total,
    currency: extra.currency || "XOF",
    shippingAddress: buildShippingAddressFromDraft({
      firstName,
      lastName,
      email,
      address1,
      address2,
      city,
      state,
      postalCode,
      country,
      phone,
    }),
  };
}

export function buildReviewSnapshot(draft, paymentMethod) {
  const nextDraft = draft || {};
  const items = Array.isArray(nextDraft.items) ? nextDraft.items : getCart();
  const subtotal = Number(nextDraft.subtotal ?? getCartSubtotal(items));
  const promoDiscount = Number(nextDraft.promoDiscount ?? 0);
  const shippingAmount = Number(nextDraft.shippingAmount ?? 0);
  const estimatedTax = Number(nextDraft.estimatedTax ?? 0);
  const saleDiscount = Number(nextDraft.saleDiscount ?? 0);
  const total = Number(nextDraft.total ?? Math.max(0, subtotal + shippingAmount + estimatedTax - promoDiscount - saleDiscount));

  return {
    email: nextDraft.email || "",
    fullName: nextDraft.fullName || "",
    phone: nextDraft.phone || "",
    country: nextDraft.country || "",
    address1: nextDraft.address1 || "",
    address2: nextDraft.address2 || "",
    city: nextDraft.city || "",
    state: nextDraft.state || "",
    zipCode: nextDraft.postalCode || nextDraft.zipCode || "",
    shippingMethod: nextDraft.shippingMethod || "standard",
    shippingMethodLabel: nextDraft.shippingMethodLabel || "",
    paymentMethod: paymentMethod || nextDraft.paymentMethod || "Card",
    promoCode: nextDraft.promoCode || "",
    currency: nextDraft.currency || "XOF",
    items: items,
    subtotal,
    shippingAmount,
    estimatedTax,
    saleDiscount,
    promoDiscount,
    total,
    shippingAddress: nextDraft.shippingAddress || buildShippingAddressFromDraft(nextDraft),
    billingAddress: nextDraft.billingAddress || nextDraft.shippingAddress || buildShippingAddressFromDraft(nextDraft),
    confirmedAt: new Date().toISOString(),
  };
}

export function buildLocalOrder(reviewSnapshot) {
  const snapshot = reviewSnapshot || buildReviewSnapshot(loadCheckoutDraft());
  const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

  return {
    id: `local-order-${Date.now()}`,
    displayOrderNumber: orderNumber,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "confirmed",
    payment_method: snapshot.paymentMethod || "Card",
    subtotal: snapshot.subtotal,
    shipping_amount: snapshot.shippingAmount,
    tax_amount: snapshot.estimatedTax,
    sale_discount: snapshot.saleDiscount,
    promo_code: snapshot.promoCode,
    promo_discount: snapshot.promoDiscount,
    total: snapshot.total,
    total_amount: snapshot.total,
    currency: snapshot.currency || "XOF",
    items: Array.isArray(snapshot.items) ? snapshot.items : [],
    shipping_address: snapshot.shippingAddress,
    billing_address: snapshot.billingAddress,
    email: snapshot.email || "",
  };
}

export function saveCheckoutDraft(draft) {
  safeWriteJson(CHECKOUT_DRAFT_KEY, draft);
  safeWriteJson(LAST_CHECKOUT_DETAILS_KEY, draft);
  return draft;
}

export function saveReviewOrder(reviewSnapshot) {
  const order = buildLocalOrder(reviewSnapshot);
  safeWriteJson(REVIEW_SNAPSHOT_KEY, {
    ...reviewSnapshot,
    linkedOrderId: order.id,
    displayOrderNumber: order.displayOrderNumber,
  });
  safeWriteJson(LATEST_ORDER_KEY, order);

  const orders = safeReadJson(ORDERS_KEY, []);
  orders.unshift(order);
  safeWriteJson(ORDERS_KEY, orders);

  localStorage.removeItem(CHECKOUT_DRAFT_KEY);
  return order;
}
